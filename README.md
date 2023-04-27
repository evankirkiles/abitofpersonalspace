<h1 align="center">
  <img src="https://user-images.githubusercontent.com/30581915/234937607-9963f0b2-80eb-429b-be4c-b05f61bfd491.png" width="200px"/>
  <br/>
  A Bit of Personal Space
</h1>

<p align="center">
A digital dimensional exploration into the spaces that define us.
</p>

<p align="center">
  <a href="https://abitofpersonal.space" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/github/deployments/evankirkiles/abitofpersonalspace/production?label=vercel"></a>
</p>

<p align="center">
Powered by <strong>Three.js</strong> and <strong>Polycam</strong>, A Bit of Personal Space allows hosting of photogrammetry spaces on the web, with full desktop, mobile, and gamepad navigation. Physics are enabled through pre-processing of spaces and adding in physics collision boxes.
</p>


<div align="center">

[Features](#features) •
[Development](#development) •
[Configuration](#configuration)

</div>
 
<div align="center" style="display: flex; flex-direction: row; justify-content: center; align-items: center; width: 100%;">
<img width="65%" alt="image" src="https://user-images.githubusercontent.com/30581915/234939921-cecb8f56-59b2-4aa5-bafc-73d8670f0400.png">
<img width="28.5%" alt="image" src="https://user-images.githubusercontent.com/30581915/234939987-7bf8068a-adc2-430a-b000-74a33657d598.png">
</div>


## Features

Todo.

| Feature | Description |
| --- |--- |
| | |

## Development

To develop locally, clone this repository and hook it into the Supabase backend by setting your environment variables in `.env.local`.

```bash
# clone the repository to your machine
git clone git@github.com:evankirkiles/abitofpersonalspace.git
cd abitofpersonalspace/
# install dependencies and begin the local web server
yarn install
yarn dev
```

> **Note**
>
> You will need to fill out a `.env.local` file in the `frontend/` directory as described in the [Configuration](#configuration) section to be able to connect to the Supabase backend from your local environment.

## Configuration

The client app expects the following environment variables to be set in order
to communicate with the backend.

```ini
# .env.local
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase anon key>
NEXT_PUBLIC_SUPABASE_URL=https://<id>.supabase.co
NEXT_PUBLIC_IMGIX_URL=<imgix url>.imgix.net
NEXT_PUBLIC_AWS_S3_REGION=<aws region>
NEXT_PUBLIC_AWS_S3_BUCKET=<aws s3 bucket>
NEXT_PUBLIC_AWS_SECRET_KEY=<s3-permissioned frontend IAM user>
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=<s3-permissioned frontend IAM user>
SUPABASE_SERVICE_ROLE_KEY=<supabase service role key>
