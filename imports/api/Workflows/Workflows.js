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
        label: 'The ID of the user this document belongs to.',
      },
      createdAt: {
        type: String,
        label: 'The date this document was created.',
        autoValue() {
          if (this.isInsert) return (new Date()).toISOString();
        },
      },
      updatedAt: {
        type: String,
        label: 'The date this document was last updated.',
        autoValue() {
          if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
        },
      },
      name: {
        type: String,
        label: 'The title of the document.',
      },
      body: {
        type: String,
        label: 'The body of the document.',
      },
})

Workflows.attachSchema(Workflows.schema);

export default Workflows;
