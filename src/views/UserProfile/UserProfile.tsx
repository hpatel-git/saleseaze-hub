import React, { useState } from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Divider from '@material-ui/core/Divider';

// core components
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import CustomInput from '../../components/CustomInput/CustomInput';
import Button from '../../components/CustomButtons/Button';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardAvatar from '../../components/Card/CardAvatar';
import CardBody from '../../components/Card/CardBody';
import CardFooter from '../../components/Card/CardFooter';
import Primary from '../../components/Typography/Primary';

import avatar from '../../assets/img/faces/marc.jpg';
import { useAppSelector } from '../../redux/hooks';
import {
  useUpdateMyProfileMutation,
  useGetMyProfileQuery
} from '../../api/saleseazeApi';

import * as yup from 'yup';
import { useFormik } from 'formik';
import UserProfileUpdateRequest from '../../api/model/userProfileUpdateRequest';
import Snackbar from '../../components/Snackbar/Snackbar';
import AddAlert from '@material-ui/icons/AddAlert';
import {
  generateUserExtraAttribute,
  isUserRegistrationComplete
} from '../../utils/userAttributeUtils';
import keycloakConfig, {
  isSaleseazeManager,
  isSaleseazeSuperAdmin,
  isSaleseazeUser
} from '../../config/keycloakConfig';
import { KeycloakProfile } from 'keycloak-js';
import { updateUserProfile } from '../../redux/auth/authSlice';
import { useAppDispatch } from '../../redux/hooks';
import { grayColor } from '../../assets/jss/material-dashboard-react';

const useStyles = makeStyles((theme) => ({
  cardCategoryWhite: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0'
  },
  cardTitle: {
    color: grayColor[2],
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: 300,
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: grayColor[1],
      fontWeight: 400,
      lineHeight: 1
    }
  },
  cardCategory: {
    color: grayColor[0],
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    paddingTop: '10px',
    marginBottom: '0'
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: 300,
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none'
  }
}));

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  firstName: yup
    .string()
    .min(3, 'FirstName should be of minimum 3 characters length')
    .required('FirstName is required'),
  lastName: yup
    .string()
    .min(3, 'Last should be of minimum 3 characters length')
    .required('LastName is required'),
  username: yup
    .string()
    .min(3, 'UserName should be of minimum 3 characters length')
    .required('UserName is required')
});

function UserProfile(props: any) {
  const classes = useStyles();
  const [updateMyProfile, { isLoading }] = useUpdateMyProfileMutation();
  const { data, refetch } = useGetMyProfileQuery();

  const [isUserProfileUpdated, setUserProfileUpdate] = useState(false);
  const [isError, setIsError] = useState(false);
  const dispatch = useAppDispatch();

  const handleUpdateMyProfile = async (
    userProfile: UserProfileUpdateRequest
  ) => {
    try {
      await updateMyProfile(userProfile).unwrap();
      setUserProfileUpdate(true);
      keycloakConfig
        .loadUserProfile()
        .then(function (profile: KeycloakProfile) {
          dispatch(updateUserProfile(profile));
        })
        .catch(function () {
          keycloakConfig.logout();
        });
      refetch();
    } catch {
      setIsError(true);
    }
  };

  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const userExtraDetails = generateUserExtraAttribute(userProfile);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: userProfile?.id,
      email: userProfile?.email,
      firstName: userProfile?.firstName,
      lastName: userProfile?.lastName,
      username: userProfile?.username,
      phoneNumber: userExtraDetails.phoneNumber,
      city: userExtraDetails.city,
      country: userExtraDetails.country,
      postalCode: userExtraDetails.postalCode,
      aboutMe: userExtraDetails.aboutMe,
      companyName: data?.company?.companyName || '',
      companyAddress: data?.company?.address || '',
      companyCity: data?.company?.city || '',
      companyCountry: data?.company?.country || '',
      companyPostalCode: data?.company?.postalCode || ''
    },
    validationSchema: validationSchema,
    validate: (values) => {},
    onSubmit: (values) => {
      let updateProfileRequest: UserProfileUpdateRequest = {
        userId: values.id,
        userName: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        city: values.city,
        country: values.country,
        postalCode: values.postalCode,
        aboutMe: values.aboutMe,
        phoneNumber: values.phoneNumber
      };
      if (keycloakConfig.hasRealmRole('SALESEAZE_MANAGER')) {
        updateProfileRequest.companyDetails = {
          companyName: values.companyName,
          address: values.companyAddress,
          city: values.companyCity,
          country: values.companyCountry,
          postalCode: values.companyPostalCode
        };
      }
      handleUpdateMyProfile(updateProfileRequest);
    }
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Snackbar
          place="bc"
          color="success"
          icon={AddAlert}
          message="User Profile Updated succesfully"
          open={isUserProfileUpdated}
          closeNotification={() => setUserProfileUpdate(false)}
          close={true}
        />
        <Snackbar
          place="bc"
          color="danger"
          icon={AddAlert}
          message="User Profile Updated failed"
          open={isError}
          closeNotification={() => setIsError(false)}
          close={true}
        />
        {isLoading && <div>Submitting</div>}
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
                <p className={classes.cardCategoryWhite}>
                  Complete your profile
                </p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="User Name"
                      id="username"
                      error={
                        formik.touched.username &&
                        Boolean(formik.errors.username)
                      }
                      errorMessage={formik.errors.username}
                      inputProps={{
                        name: 'username',
                        label: 'User Name',
                        value: `${formik.values.username}`,
                        onChange: formik.handleChange,
                        helpertext: `${
                          formik.touched.username && formik.errors.username
                        }`
                      }}
                      formControlProps={{
                        fullWidth: true,
                        disabled: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={5}>
                    <CustomInput
                      labelText="Phone Number"
                      id="phoneNumber"
                      formControlProps={{
                        fullWidth: true
                      }}
                      errorMessage={formik.errors.phoneNumber}
                      error={
                        formik.touched.phoneNumber &&
                        Boolean(formik.errors.phoneNumber)
                      }
                      inputProps={{
                        name: 'phoneNumber',
                        label: 'Phone Number',
                        value: `${formik.values.phoneNumber}`,
                        onChange: formik.handleChange,
                        helpertext: `${
                          formik.touched.phoneNumber &&
                          formik.errors.phoneNumber
                        }`
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Email address"
                      id="email"
                      errorMessage={formik.errors.email}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      inputProps={{
                        name: 'email',
                        label: 'Email',
                        value: `${formik.values.email}`,
                        onChange: formik.handleChange,
                        helpertext: `${
                          formik.touched.email && formik.errors.email
                        }`
                      }}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="First Name"
                      id="firstName"
                      errorMessage={formik.errors.firstName}
                      error={
                        formik.touched.firstName &&
                        Boolean(formik.errors.firstName)
                      }
                      inputProps={{
                        name: 'firstName',
                        label: 'First Name',
                        value: `${formik.values.firstName}`,
                        onChange: formik.handleChange,
                        helpertext: `${
                          formik.touched.firstName && formik.errors.firstName
                        }`
                      }}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Last Name"
                      errorMessage={formik.errors.lastName}
                      error={
                        formik.touched.lastName &&
                        Boolean(formik.errors.lastName)
                      }
                      id="lastName"
                      inputProps={{
                        name: 'lastName',
                        label: 'Last Name',
                        value: `${formik.values.lastName}`,
                        onChange: formik.handleChange,
                        helpertext: `${
                          formik.touched.lastName && formik.errors.lastName
                        }`
                      }}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="City"
                      errorMessage={formik.errors.city}
                      error={formik.touched.city && Boolean(formik.errors.city)}
                      id="city"
                      inputProps={{
                        name: 'city',
                        label: 'City',
                        value: `${formik.values.city}`,
                        onChange: formik.handleChange,
                        helpertext: `${
                          formik.touched.city && formik.errors.city
                        }`
                      }}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Country"
                      errorMessage={formik.errors.country}
                      error={
                        formik.touched.country && Boolean(formik.errors.country)
                      }
                      id="country"
                      inputProps={{
                        name: 'country',
                        value: `${formik.values.country}`,
                        onChange: formik.handleChange,
                        helpertext: `${
                          formik.touched.country && formik.errors.country
                        }`
                      }}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Postal Code"
                      errorMessage={formik.errors.postalCode}
                      error={
                        formik.touched.postalCode &&
                        Boolean(formik.errors.postalCode)
                      }
                      id="postalCode"
                      inputProps={{
                        name: 'postalCode',
                        //label: 'postalCode',
                        value: `${formik.values.postalCode}`,
                        onChange: formik.handleChange,
                        helpertext: `${
                          formik.touched.postalCode && formik.errors.postalCode
                        }`
                      }}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <Divider className={classes.divider} />
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <Primary>Company Details</Primary>
                  </GridItem>
                </GridContainer>
                <GridContainer mt={0}>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Company Name"
                      id="companyName"
                      errorMessage={formik.errors.companyName}
                      error={
                        formik.touched.companyName &&
                        Boolean(formik.errors.companyName)
                      }
                      inputProps={{
                        name: 'companyName',
                        value: `${formik.values.companyName}`,
                        onChange: formik.handleChange,
                        helpertext: `${
                          formik.touched.companyName &&
                          formik.errors.companyName
                        }`
                      }}
                      formControlProps={{
                        fullWidth: true,
                        disabled:
                          !isSaleseazeManager() ||
                          isUserRegistrationComplete(userProfile)
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Address"
                      errorMessage={formik.errors.companyAddress}
                      error={
                        formik.touched.companyAddress &&
                        Boolean(formik.errors.companyAddress)
                      }
                      id="companyAddress"
                      inputProps={{
                        name: 'companyAddress',
                        value: `${formik.values.companyAddress}`,
                        onChange: formik.handleChange,
                        helpertext: `${
                          formik.touched.companyAddress &&
                          formik.errors.companyAddress
                        }`
                      }}
                      formControlProps={{
                        fullWidth: true,
                        disabled: !isSaleseazeManager()
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="City"
                      errorMessage={formik.errors.companyCity}
                      error={
                        formik.touched.companyCity &&
                        Boolean(formik.errors.companyCity)
                      }
                      id="companyCity"
                      inputProps={{
                        name: 'companyCity',
                        value: `${formik.values.companyCity}`,
                        onChange: formik.handleChange,
                        helpertext: `${
                          formik.touched.companyCity &&
                          formik.errors.companyCity
                        }`
                      }}
                      formControlProps={{
                        fullWidth: true,
                        disabled: !isSaleseazeManager()
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Country"
                      errorMessage={formik.errors.companyCountry}
                      error={
                        formik.touched.companyCountry &&
                        Boolean(formik.errors.companyCountry)
                      }
                      id="companyCountry"
                      inputProps={{
                        name: 'companyCountry',
                        value: `${formik.values.companyCountry}`,
                        onChange: formik.handleChange,
                        helpertext: `${
                          formik.touched.companyCountry &&
                          formik.errors.companyCountry
                        }`
                      }}
                      formControlProps={{
                        fullWidth: true,
                        disabled: !isSaleseazeManager()
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Postal Code"
                      errorMessage={formik.errors.companyPostalCode}
                      error={
                        formik.touched.companyPostalCode &&
                        Boolean(formik.errors.companyPostalCode)
                      }
                      id="companyPostalCode"
                      inputProps={{
                        name: 'companyPostalCode',
                        value: `${formik.values.companyPostalCode}`,
                        onChange: formik.handleChange,
                        helpertext: `${
                          formik.touched.companyPostalCode &&
                          formik.errors.companyPostalCode
                        }`
                      }}
                      formControlProps={{
                        fullWidth: true,
                        disabled: !isSaleseazeManager()
                      }}
                    />
                  </GridItem>
                </GridContainer>

                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <InputLabel style={{ color: '#AAAAAA' }}>
                      About me
                      {isSaleseazeManager() && (
                        <React.Fragment> OR company</React.Fragment>
                      )}
                    </InputLabel>
                    <CustomInput
                      labelText=""
                      id="aboutMe"
                      errorMessage={formik.errors.aboutMe}
                      error={
                        formik.touched.aboutMe && Boolean(formik.errors.aboutMe)
                      }
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 5,
                        value: `${formik.values.aboutMe}`,
                        onChange: formik.handleChange,
                        helpertext: `${
                          formik.touched.aboutMe && formik.errors.aboutMe
                        }`
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button
                  color="primary"
                  type="submit"
                  disabled={!formik.dirty}
                  onClick={() => formik.submitForm()}
                >
                  Update Profile
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card profile={true}>
              <CardAvatar profile={true}>
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  <img src={avatar} alt="..." />
                </a>
              </CardAvatar>
              <CardBody profile={true}>
                <h6 className={classes.cardCategory}>
                  {isSaleseazeManager() && (
                    <React.Fragment>Saleseaze Manager</React.Fragment>
                  )}
                  {isSaleseazeSuperAdmin() && (
                    <React.Fragment>Saleseaze Super Admin</React.Fragment>
                  )}
                  {isSaleseazeUser() && (
                    <React.Fragment>Saleseaze User</React.Fragment>
                  )}
                </h6>
                <h4 className={classes.cardTitle}>{userProfile?.firstName}</h4>
                <p>{formik.values.aboutMe}</p>
                <Button color="primary" round={true}>
                  Follow
                </Button>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </form>
    </div>
  );
}

export default UserProfile;
