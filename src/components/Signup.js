import React, { Component } from 'react';
import { func } from 'prop-types';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import TextField from '@material-ui/core/TextField';

export class Signup extends Component {
  static propTypes = {
    createAccount: func,
  };

  state = {
    phone: '',
    tos: false,
    errors: {},
  };

  validate = (values) => {
    const errors = {};
    let hasErrors = false;
    values.forEach((obj) => {
      const [key, value] = Object.entries(obj)[0];

      if (key === 'tos' && value === false) {
        errors[key] = 'Must accept TOS';
        hasErrors = true;
        return;
      }

      if (!value || value.length < 2) {
        errors[key] = `${value} is too short`;
        hasErrors = true;
      }
    });
    this.setState({ errors });
    return !hasErrors;
  };

  handleSignup = (e) => {
    e.preventDefault();
    // validate

    const values = [
      { tos: this.state.tos },
      { companyName: this.form.companyName.value },
      { firstName: this.form.firstName.value },
      { lastName: this.form.lastName.value },
      { email: this.form.email.value },
      { password: this.form.password.value },
    ];

    if (this.validate(values)) {
      // if form is valid
      // contruct object to signup
      const data = {
        name: this.form.companyName.value,
        firstName: this.form.firstName.value,
        lastName: this.form.lastName.value,
        email: this.form.email.value,
        password: this.form.password.value,
        tos: this.state.tos,
      };

      this.props.createAccount(data).catch((err) => {
        if (err.response.statusCode === 422) {
          const resErrors = [];
          const errors = {};

          Object.entries(err.response.body).forEach(([key, value]) => {
            resErrors.push(`${value.messages.join(';')}`);
            if (key === 'username') {
              errors.email = value.messages.join(';');
            } else if (key === 'name') {
              errors.companyName = value.messages.join(';');
            } else {
              errors[key] = value.messages.join(';');
            }
          });

          this.setState({ resErrors, errors });
        }
      });
    }
  };

  render() {
    const {
      errors
    } = this.state;
    return (
      <div>
        <div>
          <div style={{ display: 'flex', flexFlow: 'column' }}>
            <form
              name="signup"
              ref={(e) => {
                this.form = e;
              }}
              onSubmit={this.handleSignup}
            >
              <TextField
                variant="outlined"
                label="Company Name"
                fullWidth
                name="companyName"
                id="companyName"
                error={Boolean(errors.companyName)}
              />
              <div>
                <TextField
                  variant="outlined"
                  style={{
                    marginRight: 10,
                  }}
                  label="First Name"
                  fullWidth
                  name="firstName"
                  id="firstName"
                  error={Boolean(errors.firstName)}
                />
                <TextField
                  variant="outlined"
                  label="Last Name"
                  fullWidth
                  name="lastName"
                  id="lastName"
                  error={Boolean(errors.lastName)}
                />
              </div>
              <TextField
                variant="outlined"
                label="Email/Username"
                fullWidth
                autoComplete="email"
                name="email"
                id="email"
                type="email"
                required
                error={Boolean(errors.email)}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  padding: '10px 0',
                }}
              >
                <TextField
                  id="password"
                  name="password"
                  error={Boolean(errors.password)}
                  variant="outlined"
                  style={{
                    marginRight: 12,
                  }}
                  fullWidth
                  type={this.state.showPassword ? 'text' : 'password'}
                  label="Password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={() => {
                            this.setState((state) => ({
                              showPassword: !state.showPassword,
                            }));
                          }}
                        >
                          {this.state.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                            )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div style={{ textAlign: 'center', lineHeight: '1.5' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      style={{
                        display: 'inline-block',
                        width: 24,
                        verticalAlign: 'top',
                      }}
                      checked={this.state.tos}
                      onChange={() => this.setState({ tos: true })}
                      icon={
                        <CheckBoxOutlineBlankIcon
                          color={errors.tos ? 'error' : 'primary'}
                        />
                      }
                    />
                  }
                  label="I agree to the Terms of Service"
                />
              </div>
              <div
                style={{
                  alignSelf: 'center',
                  padding: '20px 8px',
                  textAlign: 'center',
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  onClick={this.handleSignup}
                >
                  Sign up
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
