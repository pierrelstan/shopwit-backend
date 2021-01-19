import React from 'react';
import { connect } from 'react-redux';
import { Paper } from '@material-ui/core';
import { useSnackbar } from 'notistack';

const Alert = ({ alerts }) => {
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Paper
      style={{
        display: 'none',
      }}
    >
      {alerts !== null &&
        alerts.length > 0 &&
        alerts.map((alert) => (
          <div key={alert.id}>
            {enqueueSnackbar(`${alert.msg}`, {
              variant: `${alert.alertTypes}`,
              preventDuplicate: true,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
            })}
          </div>
        ))}
    </Paper>
  );
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export const MemoAlert = React.memo(connect(mapStateToProps)(Alert));
