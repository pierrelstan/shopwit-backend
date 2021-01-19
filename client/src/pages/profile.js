import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { loadUser, updateProfile } from '../redux/actions/auth';
// import MyProducts from '../components/MyProducts';
import { Container, Typography, Button } from '@material-ui/core';
import EditProfile from '../components/editProfile';

const useStyles = (theme) => ({
  container: {
    display: 'grid',
  },
  avatar: {
    display: 'inline-block',
    position: 'relative',
    width: '150px',
    height: '150px',
    overflow: 'hidden',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '5px solid #eee',
  },
  avatarOpacity: {
    display: 'inline-block',
    position: 'relative',
    width: '150px',
    height: '150px',
    overflow: 'hidden',
    borderRadius: '50%',
    objectFit: 'cover',
    opacity: 0.2,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  buttonEdit: {
    position: 'relative',
    marginRight: '30px',
  },
  colorButtonEdit: {
    color: 'blue',
  },
  colorButtonEditFalse: {
    color: '#333',
  },
  submit: {
    position: 'absolute',
    borderRadius: '10%',
    left: '190px',
  },
  containerProfile: {
    display: 'flex',
    justifyContent: 'center',
  },
  loading: {
    position: 'absolute',
    top: '127px',
    left: '66px',
  },
  container_Profile: {
    display: 'grid',
    gridTemplateColumns: '150px 1fr ',
    gridGap: '20px',
  },
});
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      greetingTheName: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      userId: '',
      error: null,
      disabled: true,
      avatar: '',
      update: false,
      edit: false,
      carts: [],
      user: null,
      transarant: '',
      successful: false,
    };
  }

  componentDidMount() {
    if (this.props.auth.user) {
      this.setState({
        greetingTheName: this.props.auth.user.firstname,
        firstname: this.props.auth.user.firstname,
        lastname: this.props.auth.user.lastname,
        email: this.props.auth.user.email,
        avatar: this.props.auth.avatar,
        userId: this.props.auth.user._id,
      });
    }
  }

  render() {
    const { lastname, userId } = this.state;
    const { classes } = this.props;
    const { user, firstname } = this.props.auth;
    return (
      <div
        style={{
          marginTop: '30px',
        }}
      >
        <Container maxWidth='lg'>
          <div
            style={{
              width: '100%',
              height: '939px',
            }}
          >
            <div>
              <div>
                <div>
                  <div>
                    <div className={classes.container_Profile}>
                      <div>
                        <img
                          className={`${classes.avatar}`}
                          alt='profile_image'
                          src={user.avatar}
                        />
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                        }}
                      >
                        <EditProfile
                          avatar={user.avatar}
                          firstname={firstname}
                          lastname={lastname}
                          userId={userId}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Typography
                  variant='h4'
                  style={{
                    margin: '20px',
                  }}
                >
                  {user.firstname}
                  <span> {user.lastname}</span>
                </Typography>
                <Typography
                  variant='h6'
                  style={{
                    margin: '20px',
                  }}
                >
                  {user.email}
                </Typography>
              </div>
            </div>
            <div>
              {menu.map((menu) => (
                <Button
                  key={menu.id}
                  variant='outlined'
                  color='primary'
                  style={{
                    margin: '10px',
                  }}
                >
                  {menu.name}
                </Button>
              ))}
            </div>

            <div>
              {menu2.map((menu) => (
                <Button
                  key={menu.id}
                  variant='outlined'
                  color='primary'
                  style={{
                    margin: '10px',
                  }}
                >
                  {menu.name}
                </Button>
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  update: state.auth.update,
  success: state.auth.message,
});
export default withStyles(useStyles)(
  connect(mapStateToProps, { loadUser, updateProfile })(Profile),
);

const menu = [
  {
    name: 'Shipping Address',
    id: 1,
  },
  {
    name: 'Payment Method',
    id: 2,
  },
  {
    name: 'Order History',
    id: 3,
  },
  {
    name: 'Delivery Status',
    id: 4,
  },
  {
    name: 'Language',
    id: 5,
  },
];

const menu2 = [
  {
    name: 'Notification Settings',
    id: 1,
  },
  {
    name: 'Privacy Policy',
    id: 2,
  },
  {
    name: 'Frequently Asked Quetions',
    id: 3,
  },
  {
    name: 'Legal Information',
    id: 4,
  },
  {
    name: 'Rate Our Information',
    id: 5,
  },
];
