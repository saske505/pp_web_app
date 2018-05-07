import React from 'react';
import PropTypes from 'prop-types';
import WorkflowEditor from '../../components/WorkflowEditor/WorkflowEditor';

const NewWorkflow = ({ history }) => (
  <div className="NewWorkflow">
    <h4 className="page-header">New Workflow</h4>
    <WorkflowEditor history={history} />
  </div>
);

NewWorkflow.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewWorkflow;
