/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class WorkspaceEditor extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        title: {
          required: true,
        },
        body: {
          required: true,
        },
        name: {
          required: false,
        },
        apiKey: {
          required: false,
        },
        apiSecret: {
          required: false,
        },
        admin: {
          required: false,
        }
      },
      messages: {
        title: {
          required: 'Need a title in here.',
        },
        body: {
          required: 'This needs a body, please.',
        },
        name: {
          required: 'This needs a name, please.',
        }
      },
      submitHandler() { component.handleSubmit(component.form); },
    });
  }

  handleSubmit(form) {
    const { history } = this.props;
    const existingWorkspace = this.props.doc && this.props.doc._id;
    const methodToCall = existingWorkspace ? 'workspaces.update' : 'workspaces.insert';
    const doc = {
      title: form.title.value.trim(),
      body: form.body.value.trim(),
      name: form.name.value.trim(),
      admin: form.admin.value.trim(),
      apiKey: form.apiKey.value.trim(),
      apiSecret: form.apiSecret.value.trim(),

    };

    if (existingWorkspace) doc._id = existingWorkspace;

    Meteor.call(methodToCall, doc, (error, spaceId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingWorkspace ? 'Workspace updated!' : 'Workspace added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/workspaces/${spaceId}`);
      }
    });
  }

  render() {
    const { doc } = this.props;
    return (
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="title"
            defaultValue={doc && doc.title}
            placeholder="Oh, The Places You'll Go!"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Body</ControlLabel>
          <textarea
            className="form-control"
            name="body"
            defaultValue={doc && doc.body}
            placeholder="Congratulations! Today is your day. You're off to Great Places! You're off and away!"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Name</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="name"
            defaultValue={doc && doc.name}
            placeholder="Workspace name"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Admin</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="admin"
            defaultValue={doc && doc.name}
            placeholder="Workspace admin"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Api key</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="apiKey"
            defaultValue={doc && doc.name}
            placeholder="Workspace api key"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>api Secret</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="apiSecret"
            defaultValue={doc && doc.name}
            placeholder="Workspace api secret"
          />
        </FormGroup>        
        <Button type="submit" bsStyle="success">
          {doc && doc._id ? 'Save Changes' : 'Add Workspace'}
        </Button>
      </form>
    );
  }
}

WorkspaceEditor.defaultProps = {
  doc: { title: '', body: '' },
};

WorkspaceEditor.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default WorkspaceEditor;
