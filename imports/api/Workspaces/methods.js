/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Workspaces from './Workspaces';
import handleMethodException from '../../modules/handle-method-exception';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'workspaces.findOne': function workspacesFindOne(workspaceId) {
    check(workspaceId, Match.OneOf(String, undefined));

    try {
      return Workspaces.findOne(workspaceId);
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'workspaces.insert': function workspacesInsert(doc) {
    check(doc, {
      title: String,
      body: String,
      name: String,
      admin: String,
      apiKey: String,
      apiSecret: String
    });

    try {
      return Workspaces.insert({ owner: this.userId, ...doc });
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'workspaces.update': function workspacesUpdate(doc) {
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
      const workspaceId = doc._id;
      const spaceToUpdate = Workspaces.findOne(workspaceId, { fields: { owner: 1 } });

      if (spaceToUpdate.owner === this.userId) {
        Workspaces.update(workspaceId, { $set: doc });
        return workspaceId; // Return _id so we can redirect to document after update.
      }

      throw new Meteor.Error('403', 'Sorry, pup. You\'re not allowed to edit this document.');
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'workspaces.remove': function workspacesRemove(workspaceId) {
    check(workspaceId, String);

    try {
      const spaceToRemove = Workspaces.findOne(workspaceId, { fields: { owner: 1 } });

      if (spaceToRemove.owner === this.userId) {
        return Workspaces.remove(workspaceId);
      }

      throw new Meteor.Error('403', 'Sorry. You\'re not allowed to delete this document.');
    } catch (exception) {
      handleMethodException(exception);
    }
  },
});

rateLimit({
  methods: [
    'workspaces.insert',
    'workspaces.update',
    'workspaces.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
