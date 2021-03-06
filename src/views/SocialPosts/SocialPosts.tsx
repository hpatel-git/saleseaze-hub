import React from 'react';
// @material-ui/core components
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';
import purple from '@material-ui/core/colors/purple';
import MuiCard from '@material-ui/core/Card';
import { FormControl, FormLabel, Grid, Typography } from '@material-ui/core';
// core components
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';

import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import AddAlert from '@material-ui/icons/AddAlert';
import {
  Avatar,
  CircularProgress,
  IconButton,
  Tooltip
} from '@material-ui/core';
import Snackbar from '../../components/Snackbar/Snackbar';
import SchedulePost from './SchedulePost';
import { useFetchCompanyPostsQuery } from '../../api/saleseazeApi';
import SocialPostItem from './SocialPostItem';
import { PublishDetails } from '../../api/model/publishPostRequest';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    facebookIconStyle: {
      display: 'flex',
      flexDirection: 'column',
      '& .kep-login-facebook.metro': {
        width: '100%',
        borderRadius: 2,
        fontSize: '14px',
        fontWeight: 500,
        textTransform: 'none',
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        paddingRight: 10,
        '& svg': {
          margin: '10px 10px 10px 10px'
        }
      }
    },
    cardCategoryWhite: {
      '&,& a,& a:hover,& a:focus': {
        color: 'rgba(255,255,255,.62)',
        margin: '0',
        fontSize: '14px',
        marginTop: '0',
        marginBottom: '0'
      },
      '& a,& a:hover,& a:focus': {
        color: '#FFFFFF'
      }
    },
    icon: {
      marginRight: theme.spacing(0.5),
      width: 20,
      height: 20
    },
    cardAction: {
      float: 'right',
      color: '#FFFFFF',
      marginTop: '-10px'
    },
    cardTitle: {
      float: 'left',
      color: '#FFFFFF'
    },
    link: {
      display: 'flex'
    },
    cardTitleWhite: {
      color: '#FFFFFF',
      marginTop: '0px',
      minHeight: 'auto',
      fontWeight: 300,
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: '3px',
      textDecoration: 'none',
      '& small': {
        color: '#777',
        fontSize: '65%',
        fontWeight: 400,
        lineHeight: 1
      }
    },
    root: {
      display: 'flex',
      margin: theme.spacing(2)
    },
    details: {
      display: 'flex',
      width: 500,
      flexDirection: 'column'
    },
    content: {
      flex: '1 0 auto'
    },
    formControl: {
      margin: theme.spacing(3),
      justifyContent: 'center',
      alignContent: 'center'
    },
    bold: {
      fontWeight: 600
    }
  })
);

function SocialPosts(props: any) {
  const classes = useStyles();

  const fetchCompanyPostsQuery = useFetchCompanyPostsQuery();

  const [isScheduleOpen, setIsScheduleOpen] = React.useState(false);

  const [isError, setIsError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const [isSuccess, setIsSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');

  const showSuccessMessage = (message: string) => {
    setIsSuccess(true);
    setSuccessMessage(message);
  };
  const handleCloseSchdule = (message?: string) => {
    setIsScheduleOpen(false);
    if (message) {
      showSuccessMessage(message!!);
    }
  };
  const handleError = (e: any, defaultMessage: string) => {
    if ('data' in e) {
      setErrorMessage(e.data.message);
    } else {
      setErrorMessage(defaultMessage);
    }
    setIsError(true);
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <SchedulePost
          isOpen={isScheduleOpen}
          closeSchedulePost={handleCloseSchdule}
        />
        <Snackbar
          place="bc"
          color="success"
          icon={AddAlert}
          message={successMessage}
          open={isSuccess}
          closeNotification={() => {
            setIsSuccess(false);
            setSuccessMessage('');
          }}
          close={true}
        />
        <Snackbar
          place="bc"
          color="danger"
          icon={AddAlert}
          message={errorMessage}
          open={isError}
          closeNotification={() => {
            setIsError(false);
            setErrorMessage('');
          }}
          close={true}
        />
        <Card>
          <CardHeader color="primary">
            <div className={classes.cardTitle}>
              <h4 className={classes.cardTitleWhite}>Upcoming Social Posts</h4>
              <div className={classes.cardCategoryWhite}>
                Here is a list of all upcoming social posts
              </div>
            </div>
            <div className={classes.cardAction}>
              <Tooltip title="Schedule a post">
                <IconButton
                  aria-label="Schedule a post"
                  onClick={() => setIsScheduleOpen(true)}
                >
                  <AddIcon style={{ color: purple[50] }} />
                </IconButton>
              </Tooltip>
            </div>
          </CardHeader>
          <CardBody>
            {fetchCompanyPostsQuery.isFetching && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </div>
            )}
            {!fetchCompanyPostsQuery.isFetching &&
              fetchCompanyPostsQuery.data &&
              fetchCompanyPostsQuery.data.content.map((item) => (
                <MuiCard className={classes.root} key={item.id}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <SocialPostItem
                        ogDescription={item.ogDescription}
                        ogImage={item.ogImage}
                        ogTitle={item.ogTitle}
                        ogSiteName={item.ogSiteName}
                        message={item.message}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Grid container>
                        <Grid item xs={12}>
                          <FormControl
                            component="fieldset"
                            color="primary"
                            className={classes.formControl}
                          >
                            <FormLabel component="legend">
                              Publish Details
                            </FormLabel>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={3}>
                              <Typography
                                variant="body2"
                                display="block"
                                className={classes.bold}
                                gutterBottom
                              >
                                Published By:
                              </Typography>
                            </Grid>
                            <Grid item xs={9}>
                              <Typography
                                variant="body2"
                                display="block"
                                gutterBottom
                              >
                                {item.createdBy}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl
                            component="fieldset"
                            color="primary"
                            //className={classes.formControl}
                          >
                            <FormLabel component="legend">
                              Page Details
                            </FormLabel>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={3}>
                              <Typography
                                variant="body2"
                                display="block"
                                className={classes.bold}
                                gutterBottom
                              >
                                Page Name
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography
                                variant="body2"
                                display="block"
                                className={classes.bold}
                                gutterBottom
                              >
                                Status
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography
                                variant="body2"
                                display="block"
                                className={classes.bold}
                                gutterBottom
                              >
                                Response Status
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        {item.publishDetails &&
                          item.publishDetails.map(
                            (publishDetail: PublishDetails) => (
                              <Grid item xs={12}>
                                <Grid container>
                                  <Grid item xs={3}>
                                    <Typography
                                      variant="body2"
                                      display="block"
                                      gutterBottom
                                    >
                                      {publishDetail.pageName}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={3}>
                                    <Typography
                                      variant="body2"
                                      display="block"
                                      gutterBottom
                                    >
                                      {publishDetail.status}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={3}>
                                    <Typography
                                      variant="body2"
                                      display="block"
                                      gutterBottom
                                    >
                                      {publishDetail.responseStatus}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            )
                          )}
                      </Grid>
                    </Grid>
                  </Grid>
                </MuiCard>
              ))}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

export default SocialPosts;
