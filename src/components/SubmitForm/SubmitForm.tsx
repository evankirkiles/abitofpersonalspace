/*
 * SubmitForm.tsx
 * author: evan kirkiles
 * created on Mon Oct 10 2022
 * 2022 the nobot space,
 */
import { useRef, useState } from 'react';
import FileUpload from '../FileUpload/FileUpload';
import { CSSTransition } from 'react-transition-group';
import TextareaAutosize from 'react-textarea-autosize';
import s from './SubmitForm.module.scss';
import { useMutation } from 'react-query';
import { v4 as uuid } from 'uuid';
import { uploadFile } from '../../util/s3client';
import { insertSpace } from '../../supabase/api/spaces';
import getImageDimensions from '../../util/getImageDimensions';
import * as APIt from '../../supabase/types';
import { insertSpacePrivate } from '../../supabase/api/spaces_private';
import { useRouter } from 'next/router';

const SubmitForm: React.FC = function () {
  // use router for redirecting to space page when finished
  const router = useRouter();

  // input field forms
  const formRef = useRef<HTMLFormElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [doorFile, setDoorFile] = useState<File | null>(null);
  const [spaceFile, setSpaceFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // mutation messages
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // form submission functions as a mutation
  const submit = useMutation(
    async () => {
      // if none of any required fields, fail.
      if (!doorFile || !spaceFile || !title || !email)
        throw new Error('invalid inputs.');

      /* ---------------------------- upload files ---------------------------- */
      // 0. generate s3 prefix from space title + some basic salt
      const SPACE_S3_PREFIX = `spaces/${title.replace(
        /[^a-zA-Z0-9-_\.]/g,
        ''
      )}_${uuid().substring(0, 5)}`;

      // 1. upload each s3 file
      // door file
      setStatusMessage('Uploading door...');
      const doorFileKey = `${SPACE_S3_PREFIX}/${doorFile.name.replace(
        /[^a-zA-Z0-9-_\.]/g,
        ''
      )}`;
      const file_door_dimensions = await getImageDimensions(
        URL.createObjectURL(doorFile)
      );
      const door_object = await uploadFile(doorFileKey, doorFile);
      // space file
      setStatusMessage('Uploading space...');
      const spaceFileKey = `${SPACE_S3_PREFIX}/${spaceFile.name.replace(
        /[^a-zA-Z0-9-_\.]/g,
        ''
      )}`;
      const space_object = await uploadFile(spaceFileKey, spaceFile);

      /* --------------------------- generate entry --------------------------- */

      // 2. using the uploaded file keys, create the space entry
      setStatusMessage('Creating space submission...');
      const space = (
        await insertSpace({
          title,
          description: description || undefined,
          author: author || undefined,
          verified: false,
          location: location || undefined,
          door_handle_on_right: true,
          file_door: {
            ...file_door_dimensions,
            object: door_object,
          },
          file_space: space_object,
        })
      )[0];
      // insert the email to refer to the space
      await insertSpacePrivate({
        space_id: space.id,
        email,
      });

      // 3. finished.
      setStatusMessage('done!');
      return space;
    },
    {
      onSuccess: () => {
        // redirect to home on success
        router.push('/');
      },
      onError: () => {
        // do not redirect on error
        setStatusMessage(null);
      },
    }
  );

  // submits the form, beginning the async submission
  const onFormSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (!submit.isLoading) submit.mutate();
    return false;
  };

  // whether or not the form can be submitted
  const canSubmit = !!title && !!doorFile && !!spaceFile && !!email;

  return (
    <div className={s.container}>
      <h1 className={s.title}>submit your space.</h1>
      <p className={s.subtext}>
        if you would like to contribute your own personal space to the project,
        follow the instructions here to create a scan. upon submission, i will
        create collision boxes for your space and mark it as verified as soon as
        i can, allowing your space to be explored and engaged with by the
        audience.
      </p>
      <form
        className={s.form_container}
        id="spaceForm"
        ref={formRef}
        onSubmit={onFormSubmit}
      >
        <div className={s.annotation}>
          Upload your files – submit the files of your space.
        </div>
        <div className={s.upload_row}>
          <div className={s.file_upload_container}>
            <FileUpload
              file={doorFile}
              setFile={setDoorFile}
              accept={'image/*'}
              required
            >
              <div className={`${s.file_type} ${s.required}`}>DOOR</div>
              <div className={s.file_accepts}>.png, .jpg...</div>
            </FileUpload>
          </div>
          <div className={s.file_upload_container} style={{ flex: 2 }}>
            <FileUpload
              file={spaceFile}
              setFile={setSpaceFile}
              accept={'.glb'}
              required
            >
              <div className={`${s.file_type} ${s.required}`}>SPACE</div>
              <div className={s.file_accepts}>.glb</div>
            </FileUpload>
          </div>
        </div>
        <div className={s.annotation}>
          Identify your space – add as much information as you wish.
        </div>
        <table className={s.input_table} onSubmit={onFormSubmit}>
          <tbody>
            <tr>
              <td>
                <label htmlFor={'title'} className={s.required}>
                  Title:
                </label>
              </td>
              <td>
                <input
                  id="title"
                  className={s.input_field}
                  value={title}
                  type="text"
                  required
                  spellCheck={false}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="author">Author: </label>
              </td>
              <td>
                <input
                  id="author"
                  className={s.input_field}
                  value={author}
                  type="text"
                  spellCheck={false}
                  onChange={(e) => {
                    setAuthor(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor={'location'}>Location: </label>
              </td>
              <td>
                <input
                  id="location"
                  className={s.input_field}
                  value={location}
                  type="text"
                  spellCheck={false}
                  onChange={(e) => {
                    setLocation(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor={'description'}>Description: </label>
              </td>
              <td>
                <TextareaAutosize
                  className={s.input_field}
                  spellCheck={false}
                  value={description}
                  minRows={3}
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                ></TextareaAutosize>
              </td>
            </tr>
          </tbody>
        </table>
        <div className={s.annotation}>
          Email – will not be shared publicly. used for updates on your
          space&apos;s verification status.
        </div>
        <div className={s.input_row}>
          <label htmlFor="email" className={s.required}>
            Email:
          </label>
          <input
            id="email"
            className={s.input_field}
            value={email}
            type="email"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className={s.form_required_note}>
          <span className={s.required}></span> marks a required field.
        </div>
        <CSSTransition
          appear
          mountOnEnter
          unmountOnExit
          in={submit.isLoading}
          timeout={300}
          nodeRef={overlayRef}
        >
          <div className={s.form_overlay} ref={overlayRef}>
            {statusMessage}
          </div>
        </CSSTransition>
      </form>
      <div className={s.submit_row}>
        <div
          className={`${s.submit_button} ${
            canSubmit && !submit.isLoading ? 'ready' : ''
          }`}
          onClick={() => formRef.current?.requestSubmit()}
        >
          SUBMIT{' '}
        </div>
      </div>
    </div>
  );
};

export default SubmitForm;
