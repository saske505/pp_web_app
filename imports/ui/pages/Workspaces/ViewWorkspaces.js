import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Workspaces from '../../../api/Workspaces/Workspaces';
import SEO from '../../components/SEO/SEO';
import NotFound from '../NotFound/NotFound';

const handleRemove = (workspaceId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('workspaces.remove', workspaceId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Workspace deleted!', 'success');
        history.push('/workspaces');
      }
    });
  }
};

const renderWorkspace = (doc, match, history) => (doc ? (
  <div className="ViewWorkspace">
    <SEO
      title={doc.name}
      description={doc.body}
      url={`workspaces/${doc._id}`}
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

const ViewWorkspace = ({ doc, match, history }) => (renderWorkspace(doc, match, history));

ViewWorkspace.defaultProps = {
  doc: null,
};

ViewWorkspace.propTypes = {
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  connect(state => ({ ...state })),
  withTracker(({ match }) => {
    const workspaceId = match.params._id;
    if (Meteor.isClient) Meteor.subscribe('workspaces.view', workspaceId);

    return {
      doc: Workspaces.findOne(workspaceId),
    };
  }),
)(ViewWorkspace);
