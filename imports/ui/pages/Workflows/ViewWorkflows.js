import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Workflows from '../../../api/Workflows/Workflows';
import SEO from '../../components/SEO/SEO';
import NotFound from '../NotFound/NotFound';

const handleRemove = (workflowId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('workflows.remove', workflowId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Workspace deleted!', 'success');
        history.push('/workflows');
      }
    });
  }
};

const renderWorkflow = (doc, match, history) => (doc ? (
  <div className="ViewWorkflow">
    <SEO
      title={doc.name}
      description={doc.body}
      url={`workflows/${doc._id}`}
      contentType="article"
      published={doc.createdAt}
      updated={doc.updatedAt}
      twitter="clvrbgl"
    />
    <div className="page-header clearfix">
      <h4 className="pull-left">{ doc && doc.name }</h4>
      {Meteor.isClient && Meteor.userId() ? (
        <ButtonToolbar className="pull-right">
          <ButtonGroup bsSize="small">
            <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
            <Button onClick={() => handleRemove(doc._id, history)} className="text-danger">
              Delete
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
      ) : ''}
    </div>
    { doc && doc.body }
  </div>
) : <NotFound />);

const ViewWorkflow = ({ doc, match, history }) => (renderWorkflow(doc, match, history));

ViewWorkflow.defaultProps = {
  doc: null,
};

ViewWorkflow.propTypes = {
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  connect(state => ({ ...state })),
  withTracker(({ match }) => {
    const workflowId = match.params._id;
    if (Meteor.isClient) Meteor.subscribe('workflows.view', workflowId);

    return {
      doc: Workflows.findOne(workflowId),
    };
  }),
)(ViewWorkflow);
