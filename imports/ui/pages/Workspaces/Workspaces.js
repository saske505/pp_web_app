import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import WorkspacesCollection from '../../../api/Workspaces/Workspaces';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';
import BlankState from '../../components/BlankState/BlankState';

const StyledDocuments = styled.div`
  table tbody tr td {
    vertical-align: middle;
  }
`;

const handleRemove = (spaceId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('workspaces.remove', spaceId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Space deleted!', 'success');
      }
    });
  }
};

const Workspaces = ({
  loading, workspaces, match, history,
}) => (!loading ? (
  <StyledDocuments>
    <div className="page-header clearfix">
      <h4 className="pull-left">Workspaces</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add Workspace</Link>
    </div>
    {workspaces.length ?
      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last Updated</th>
            <th>Created</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {workspaces.map(({
            _id, name, createdAt, updatedAt,
          }) => (
            <tr key={_id}>
              <td>{name}</td>
              <td>{timeago(updatedAt)}</td>
              <td>{monthDayYearAtTime(createdAt)}</td>
              <td>
                <Button
                  bsStyle="primary"
                  onClick={() => history.push(`${match.url}/${_id}`)}
                  block
                >
                  View
                </Button>
              </td>
              <td>
                <Button
                  bsStyle="danger"
                  onClick={() => handleRemove(_id)}
                  block
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> : <BlankState
        icon=""
        title="You're plum out of workspaces, friend!"
        subtitle="Add your first  by clicking the button below."
        action={{
          style: 'success',
          onClick: () => history.push(`${match.url}/new`),
          label: 'Create Your First Document',
        }}
      />}
  </StyledDocuments>
) : <Loading />);

Workspaces.propTypes = {
  loading: PropTypes.bool.isRequired,
  workspaces: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('workspaces');
  return {
    loading: !subscription.ready(),
    workspaces: WorkspacesCollection.find().fetch(),
  };
})(Workspaces);
