import React from 'react';
import PropTypes from 'prop-types';
import WorkspaceEditor from '../../components/WorkspaceEditor/WorkspaceEditor';

const NewWorkspace = ({ history }) => (
  <div className="NewWorkspace">
    <h4 className="page-header">New Workspace</h4>
    <WorkspaceEditor history={history} />
  </div>
);

NewWorkspace.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewWorkspace;
