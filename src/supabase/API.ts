/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/': {
    get: {
      responses: {
        /** OK */
        200: unknown;
      };
    };
  };
  '/spaces_private': {
    get: {
      parameters: {
        query: {
          space_id?: parameters['rowFilter.spaces_private.space_id'];
          email?: parameters['rowFilter.spaces_private.email'];
          /** Filtering Columns */
          select?: parameters['select'];
          /** Ordering */
          order?: parameters['order'];
          /** Limiting and Pagination */
          offset?: parameters['offset'];
          /** Limiting and Pagination */
          limit?: parameters['limit'];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters['range'];
          /** Limiting and Pagination */
          'Range-Unit'?: parameters['rangeUnit'];
          /** Preference */
          Prefer?: parameters['preferCount'];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions['spaces_private'][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** spaces_private */
          spaces_private?: definitions['spaces_private'];
        };
        query: {
          /** Filtering Columns */
          select?: parameters['select'];
        };
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn'];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          space_id?: parameters['rowFilter.spaces_private.space_id'];
          email?: parameters['rowFilter.spaces_private.email'];
        };
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn'];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          space_id?: parameters['rowFilter.spaces_private.space_id'];
          email?: parameters['rowFilter.spaces_private.email'];
        };
        body: {
          /** spaces_private */
          spaces_private?: definitions['spaces_private'];
        };
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn'];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
  '/spaces': {
    get: {
      parameters: {
        query: {
          id?: parameters['rowFilter.spaces.id'];
          created_at?: parameters['rowFilter.spaces.created_at'];
          title?: parameters['rowFilter.spaces.title'];
          description?: parameters['rowFilter.spaces.description'];
          author?: parameters['rowFilter.spaces.author'];
          file_door?: parameters['rowFilter.spaces.file_door'];
          file_space?: parameters['rowFilter.spaces.file_space'];
          verified?: parameters['rowFilter.spaces.verified'];
          location?: parameters['rowFilter.spaces.location'];
          /** Direction which the door image opens */
          door_handle_on_right?: parameters['rowFilter.spaces.door_handle_on_right'];
          href?: parameters['rowFilter.spaces.href'];
          /** Filtering Columns */
          select?: parameters['select'];
          /** Ordering */
          order?: parameters['order'];
          /** Limiting and Pagination */
          offset?: parameters['offset'];
          /** Limiting and Pagination */
          limit?: parameters['limit'];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters['range'];
          /** Limiting and Pagination */
          'Range-Unit'?: parameters['rangeUnit'];
          /** Preference */
          Prefer?: parameters['preferCount'];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions['spaces'][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** spaces */
          spaces?: definitions['spaces'];
        };
        query: {
          /** Filtering Columns */
          select?: parameters['select'];
        };
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn'];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          id?: parameters['rowFilter.spaces.id'];
          created_at?: parameters['rowFilter.spaces.created_at'];
          title?: parameters['rowFilter.spaces.title'];
          description?: parameters['rowFilter.spaces.description'];
          author?: parameters['rowFilter.spaces.author'];
          file_door?: parameters['rowFilter.spaces.file_door'];
          file_space?: parameters['rowFilter.spaces.file_space'];
          verified?: parameters['rowFilter.spaces.verified'];
          location?: parameters['rowFilter.spaces.location'];
          /** Direction which the door image opens */
          door_handle_on_right?: parameters['rowFilter.spaces.door_handle_on_right'];
          href?: parameters['rowFilter.spaces.href'];
        };
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn'];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          id?: parameters['rowFilter.spaces.id'];
          created_at?: parameters['rowFilter.spaces.created_at'];
          title?: parameters['rowFilter.spaces.title'];
          description?: parameters['rowFilter.spaces.description'];
          author?: parameters['rowFilter.spaces.author'];
          file_door?: parameters['rowFilter.spaces.file_door'];
          file_space?: parameters['rowFilter.spaces.file_space'];
          verified?: parameters['rowFilter.spaces.verified'];
          location?: parameters['rowFilter.spaces.location'];
          /** Direction which the door image opens */
          door_handle_on_right?: parameters['rowFilter.spaces.door_handle_on_right'];
          href?: parameters['rowFilter.spaces.href'];
        };
        body: {
          /** spaces */
          spaces?: definitions['spaces'];
        };
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn'];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
  '/tags': {
    get: {
      parameters: {
        query: {
          type?: parameters['rowFilter.tags.type'];
          title?: parameters['rowFilter.tags.title'];
          code?: parameters['rowFilter.tags.code'];
          created_at?: parameters['rowFilter.tags.created_at'];
          /** Filtering Columns */
          select?: parameters['select'];
          /** Ordering */
          order?: parameters['order'];
          /** Limiting and Pagination */
          offset?: parameters['offset'];
          /** Limiting and Pagination */
          limit?: parameters['limit'];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters['range'];
          /** Limiting and Pagination */
          'Range-Unit'?: parameters['rangeUnit'];
          /** Preference */
          Prefer?: parameters['preferCount'];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions['tags'][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** tags */
          tags?: definitions['tags'];
        };
        query: {
          /** Filtering Columns */
          select?: parameters['select'];
        };
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn'];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          type?: parameters['rowFilter.tags.type'];
          title?: parameters['rowFilter.tags.title'];
          code?: parameters['rowFilter.tags.code'];
          created_at?: parameters['rowFilter.tags.created_at'];
        };
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn'];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          type?: parameters['rowFilter.tags.type'];
          title?: parameters['rowFilter.tags.title'];
          code?: parameters['rowFilter.tags.code'];
          created_at?: parameters['rowFilter.tags.created_at'];
        };
        body: {
          /** tags */
          tags?: definitions['tags'];
        };
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn'];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
  '/spaces_view': {
    get: {
      parameters: {
        query: {
          id?: parameters['rowFilter.spaces_view.id'];
          title?: parameters['rowFilter.spaces_view.title'];
          description?: parameters['rowFilter.spaces_view.description'];
          author?: parameters['rowFilter.spaces_view.author'];
          file_door?: parameters['rowFilter.spaces_view.file_door'];
          file_space?: parameters['rowFilter.spaces_view.file_space'];
          created_at?: parameters['rowFilter.spaces_view.created_at'];
          verified?: parameters['rowFilter.spaces_view.verified'];
          location?: parameters['rowFilter.spaces_view.location'];
          /** Filtering Columns */
          select?: parameters['select'];
          /** Ordering */
          order?: parameters['order'];
          /** Limiting and Pagination */
          offset?: parameters['offset'];
          /** Limiting and Pagination */
          limit?: parameters['limit'];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters['range'];
          /** Limiting and Pagination */
          'Range-Unit'?: parameters['rangeUnit'];
          /** Preference */
          Prefer?: parameters['preferCount'];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions['spaces_view'][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** spaces_view */
          spaces_view?: definitions['spaces_view'];
        };
        query: {
          /** Filtering Columns */
          select?: parameters['select'];
        };
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn'];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          id?: parameters['rowFilter.spaces_view.id'];
          title?: parameters['rowFilter.spaces_view.title'];
          description?: parameters['rowFilter.spaces_view.description'];
          author?: parameters['rowFilter.spaces_view.author'];
          file_door?: parameters['rowFilter.spaces_view.file_door'];
          file_space?: parameters['rowFilter.spaces_view.file_space'];
          created_at?: parameters['rowFilter.spaces_view.created_at'];
          verified?: parameters['rowFilter.spaces_view.verified'];
          location?: parameters['rowFilter.spaces_view.location'];
        };
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn'];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          id?: parameters['rowFilter.spaces_view.id'];
          title?: parameters['rowFilter.spaces_view.title'];
          description?: parameters['rowFilter.spaces_view.description'];
          author?: parameters['rowFilter.spaces_view.author'];
          file_door?: parameters['rowFilter.spaces_view.file_door'];
          file_space?: parameters['rowFilter.spaces_view.file_space'];
          created_at?: parameters['rowFilter.spaces_view.created_at'];
          verified?: parameters['rowFilter.spaces_view.verified'];
          location?: parameters['rowFilter.spaces_view.location'];
        };
        body: {
          /** spaces_view */
          spaces_view?: definitions['spaces_view'];
        };
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn'];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
}

export interface definitions {
  /** @description Private information about spaces */
  spaces_private: {
    /**
     * Format: uuid
     * @description Note:
     * This is a Primary Key.<pk/>
     */
    space_id: string;
    /** Format: text */
    email: string;
  };
  /** @description Personal spaces on the site */
  spaces: {
    /**
     * Format: uuid
     * @description Note:
     * This is a Primary Key.<pk/>
     * @default extensions.uuid_generate_v4()
     */
    id: string;
    /**
     * Format: timestamp with time zone
     * @default now()
     */
    created_at: string;
    /** Format: text */
    title: string;
    /** Format: text */
    description?: string;
    /** Format: text */
    author?: string;
    /** Format: jsonb */
    file_door?: unknown;
    /** Format: jsonb */
    file_space: unknown;
    /**
     * Format: boolean
     * @default false
     */
    verified: boolean;
    /** Format: text */
    location?: string;
    /**
     * Format: boolean
     * @description Direction which the door image opens
     * @default false
     */
    door_handle_on_right: boolean;
    /** Format: text */
    href?: string;
  };
  /** @description Tags to be applied to spaces */
  tags: {
    /** Format: character varying */
    type?: string;
    /** Format: text */
    title?: string;
    /**
     * Format: character varying
     * @description Note:
     * This is a Primary Key.<pk/>
     */
    code: string;
    /**
     * Format: timestamp with time zone
     * @default now()
     */
    created_at: string;
  };
  spaces_view: {
    /**
     * Format: uuid
     * @description Note:
     * This is a Primary Key.<pk/>
     */
    id?: string;
    /** Format: text */
    title?: string;
    /** Format: text */
    description?: string;
    /** Format: text */
    author?: string;
    /** Format: jsonb */
    file_door?: unknown;
    /** Format: jsonb */
    file_space?: unknown;
    /** Format: timestamp with time zone */
    created_at?: string;
    /** Format: boolean */
    verified?: boolean;
    /** Format: text */
    location?: string;
  };
}

export interface parameters {
  /**
   * @description Preference
   * @enum {string}
   */
  preferParams: 'params=single-object';
  /**
   * @description Preference
   * @enum {string}
   */
  preferReturn: 'return=representation' | 'return=minimal' | 'return=none';
  /**
   * @description Preference
   * @enum {string}
   */
  preferCount: 'count=none';
  /** @description Filtering Columns */
  select: string;
  /** @description On Conflict */
  on_conflict: string;
  /** @description Ordering */
  order: string;
  /** @description Limiting and Pagination */
  range: string;
  /**
   * @description Limiting and Pagination
   * @default items
   */
  rangeUnit: string;
  /** @description Limiting and Pagination */
  offset: string;
  /** @description Limiting and Pagination */
  limit: string;
  /** @description spaces_private */
  'body.spaces_private': definitions['spaces_private'];
  /** Format: uuid */
  'rowFilter.spaces_private.space_id': string;
  /** Format: text */
  'rowFilter.spaces_private.email': string;
  /** @description spaces */
  'body.spaces': definitions['spaces'];
  /** Format: uuid */
  'rowFilter.spaces.id': string;
  /** Format: timestamp with time zone */
  'rowFilter.spaces.created_at': string;
  /** Format: text */
  'rowFilter.spaces.title': string;
  /** Format: text */
  'rowFilter.spaces.description': string;
  /** Format: text */
  'rowFilter.spaces.author': string;
  /** Format: jsonb */
  'rowFilter.spaces.file_door': string;
  /** Format: jsonb */
  'rowFilter.spaces.file_space': string;
  /** Format: boolean */
  'rowFilter.spaces.verified': string;
  /** Format: text */
  'rowFilter.spaces.location': string;
  /**
   * Format: boolean
   * @description Direction which the door image opens
   */
  'rowFilter.spaces.door_handle_on_right': string;
  /** Format: text */
  'rowFilter.spaces.href': string;
  /** @description tags */
  'body.tags': definitions['tags'];
  /** Format: character varying */
  'rowFilter.tags.type': string;
  /** Format: text */
  'rowFilter.tags.title': string;
  /** Format: character varying */
  'rowFilter.tags.code': string;
  /** Format: timestamp with time zone */
  'rowFilter.tags.created_at': string;
  /** @description spaces_view */
  'body.spaces_view': definitions['spaces_view'];
  /** Format: uuid */
  'rowFilter.spaces_view.id': string;
  /** Format: text */
  'rowFilter.spaces_view.title': string;
  /** Format: text */
  'rowFilter.spaces_view.description': string;
  /** Format: text */
  'rowFilter.spaces_view.author': string;
  /** Format: jsonb */
  'rowFilter.spaces_view.file_door': string;
  /** Format: jsonb */
  'rowFilter.spaces_view.file_space': string;
  /** Format: timestamp with time zone */
  'rowFilter.spaces_view.created_at': string;
  /** Format: boolean */
  'rowFilter.spaces_view.verified': string;
  /** Format: text */
  'rowFilter.spaces_view.location': string;
}

export interface operations {}

export interface external {}
