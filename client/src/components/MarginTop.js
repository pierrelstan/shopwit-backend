import React from 'react';
// import styled from 'styled-components';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles({
  root: {
    // marginTop: '300px',
  },
  root1: {
    marginTop: '10px',
  },
});
// const Container = styled.div`
//   @media (max-width: 320px) {
//     margin-top: 10px;
//   }
// `;

export default function MarginTop({ children }) {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <div className={matches ? classes.root1 : classes.root}>{children}</div>
  );
}
