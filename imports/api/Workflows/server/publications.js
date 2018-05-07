import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Workflows from '../Workflows';

Meteor.publish('workflows', function workflows() {
  return Workflows.find({ owner: this.userId });
});

// Note: documents.view is also used when editing an existing document.
Meteor.publish('workflows.view', (workflowId) => {
  check(workflowId, String);
  return Workflows.find({ _id: workflowId });
});

Meteor.publish('workflowId.edit', function workflowsEdit(workflowId) {
  check(Workflows, String);
  return Workflows.find({ _id: workflowId, owner: this.userId });
});
