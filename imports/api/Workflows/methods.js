/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Workflows from './Workflows';
import handleMethodException from '../../modules/handle-method-exception';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'workflows.findOne': function workflowsFindOne(workflowId) {
    check(workflowId, Match.OneOf(String, undefined));

    try {
      return Workflows.findOne(workflowId);
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'workflows.insert': function workflowsInsert(doc) {
    check(doc, {
      title: String,
      body: String,
      name: String,
      admin: String,
      apiKey: String,
      apiSecret: String
    });

    try {
      return Workflows.insert({ owner: this.userId, ...doc });
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'workflows.update': function workflowsUpdate(doc) {
    check(doc, {
      _id: String,
      title: String,
      body: String,
      name: String,
      admin: String,
      apiKey: String,
      apiSecret: String
    });

    try {
      const workflowId = doc._id;
      const flowToUpdate = Workflows.findOne(workflowId, { fields: { owner: 1 } });

      if (flowToUpdate.owner === this.userId) {
        Workflows.update(workflowId, { $set: doc });
        return workflowId; // Return _id so we can redirect to document after update.
      }

      throw new Meteor.Error('403', 'Sorry, pup. You\'re not allowed to edit this document.');
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'workflows.remove': function workflowsRemove(workflowId) {
    check(workflowId, String);

    try {
      const spaceToRemove = Workflows.findOne(workflowId, { fields: { owner: 1 } });

      if (spaceToRemove.owner === this.userId) {
        return Workflows.remove(workflowId);
      }

      throw new Meteor.Error('403', 'Sorry. You\'re not allowed to delete this document.');
    } catch (exception) {
      handleMethodException(exception);
    }
  },
});

rateLimit({
  methods: [
    'workflows.insert',
    'workflows.update',
    'workflows.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
