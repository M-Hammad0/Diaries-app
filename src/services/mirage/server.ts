import { Server, Model, Factory, belongsTo, hasMany, Response } from 'miragejs';
import user from './routes/user';
import * as diary from './routes/diary';

export const handleErrors = (error: any, message = 'An error ocurred') => {
  return new Response(400, undefined, {
    data: {
      message,
      isError: true,
    },
  });
};

export const setupServer = (env?: string): Server => {
  return new Server({
    environment: env ?? 'development',

    models: {                  //relational data
      entry: Model.extend({    // an entry belongs to a diary 
        diary: belongsTo(),
      }),
      diary: Model.extend({     
        entry: hasMany(),       // a diary has many entries
        user: belongsTo(),      // each diary belongs to a user
      }),
      user: Model.extend({      
        diary: hasMany(),       // each user has many diaries
      }),
    },

    factories: {
      user: Factory.extend({
        username: 'test',
        password: 'password',
        email: 'test@email.com',
      }),
    },

    seeds: (server): any => { // initial data for server
      server.create('user');
    },

    routes(): void {
      this.urlPrefix = 'https://diaries.app';

      this.get('/diaries/entries/:id', diary.getEntries);
      this.get('/diaries/:id', diary.getDiaries);

      this.post('/auth/login', user.login);
      this.post('/auth/signup', user.signup);

      this.post('/diaries/', diary.create);
      this.post('/diaries/entry/:id', diary.addEntry);

      this.put('/diaries/entry/:id', diary.updateEntry);
      this.put('/diaries/:id', diary.updateDiary);
    },
  });
};
