/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Workflows = new Mongo.Collection('Workflows');

Workflows.allow({
    insert: () => false,
    update: () => false,
    remove: () => false,
  });
  
  Workflows.deny({
    insert: () => true,
    update: () => true,
    remove: () => true,
});

Workflows.schema = new SimpleSchema({
      owner: {
        type: String,
        label: 'The ID of the user this workspace belongs to.',
      },
      createdAt: {
        type: String,
        label: 'The date this workspace was created.',
        autoValue() {
          if (this.isInsert) return (new Date()).toISOString();
        },
      },
      updatedAt: {
        type: String,
        label: 'The date this workspace was last updated.',
        autoValue() {
          if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
        },
      },
      name: {
        type: String,
        label: 'The name of the workspace.',        
      },
      body: {
        type: String,
        label: 'The body of the workspace.',
      },
      admin : {
        type : String,
        label : 'the workspace admin',
      },
      apiKey : {
        type : String,
        label : 'api key for the workspace'
      },
      apiSecret : {
        type : String,
        label : 'api secret for the workspace'
      }
})

Workflows.attachSchema(Workflows.schema);

export default Workflows;
