import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Workspaces from '../Workspaces';

Meteor.publish('workspaces', function workspaces() {
  return Workspaces.find({ owner: this.userId });
});

// Note: documents.view is also used when editing an existing document.
Meteor.publish('workspaces.view', (workspaceId) => {
  check(workspaceId, String);
  return Workspaces.find({ _id: workspaceId });
});

Meteor.publish('workspaces.edit', function workspacesEdit(workspaceId) {
  check(workspaceId, String);
  return Workspaces.find({ _id: workspaceId, owner: this.userId });
});
