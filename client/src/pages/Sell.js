import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@material-ui/core/styles';
import Wrapper from '../components/Wrapper';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { CreateItem } from '../redux/actions/ItemsActions';
import { Container } from '@material-ui/core';
import {
  Image,
  Video,
  Transformation,
  CloudinaryContext,
} from 'cloudinary-react';

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

const currencies = [
  {
    value: 'Men',
    label: 'Men',
  },
  {
    value: 'Woman',
    label: 'Woman',
  },
  {
    value: 'Children',
    label: 'Children',
  },
];

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3),
  },
  containerSubmit: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
  },
}));
const iniTialState = {
  title: '',
  description: '',
  price: '',
  imageUrl: '',
  quantityProducts: '',
  genre: 'Default',
};
const Sell = ({ CreateItem, history }) => {
  const [product, setProduct] = React.useState(iniTialState);
  const classes = useStyles();
  const uploadedImage = React.useRef(null);
  const [previewSource, setPreviewSource] = React.useState();

  const handleImageUpload = (e) => {
    console.log();
    const [file] = e.target.files;
    console.log(file);
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = (e) => {
        current.src = e.target.result;
        setPreviewSource(e.target.result);
        setProduct({ ...product, imageUrl: e.target.result });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleChange = (event) => {
    console.log(event.target);
    setProduct({ ...product, [event.target.name]: event.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    CreateItem(product, history);
    console.log(product);
  };

  return (
    <Container>
      <div>
        <ThemeProvider theme={theme}>
          <Typography variant='h4' className={classes.title}>
            Enter your Product infos
          </Typography>
        </ThemeProvider>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            id='genre'
            select
            label='genre'
            name='genre'
            value={product.genre}
            defaultChecked={product.genre}
            onChange={handleChange}
            helperText='Please select the genre for the product'
            variant='outlined'
            required
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            variant='outlined'
            margin='normal'
            required={true}
            fullWidth
            id='title'
            label='Title'
            name='title'
            autoComplete='title'
            value={product.title}
            onChange={handleChange}
          />
          <TextField
            variant='outlined'
            margin='normal'
            required={true}
            fullWidth
            name='description'
            label='Description'
            id='description'
            autoComplete='description'
            value={product.description}
            onChange={handleChange}
          />
          <TextField
            required={true}
            name='imageUrl'
            id='imageUrl'
            type='file'
            ref={uploadedImage}
            onChange={handleImageUpload}
          />

          <TextField
            variant='outlined'
            margin='normal'
            required={true}
            fullWidth
            name='price'
            label='Price'
            id='price'
            autoComplete='price'
            value={product.price}
            onChange={handleChange}
          />

          <TextField
            variant='outlined'
            margin='normal'
            required={true}
            fullWidth
            id='quantityProducts'
            label='Quantity'
            name='quantityProducts'
            autoComplete='quantityProducts'
            value={product.quantityProducts}
            onChange={handleChange}
          />
          <div className={classes.containerSubmit}>
            <Button
              type='submit'
              variant='outlined'
              color='primary'
              className={classes.submit}
              value='Submit'
            >
              Submit
            </Button>
          </div>
        </form>
        {previewSource && (
          <img
            src={previewSource}
            alt='chosern'
            style={{
              height: '300px',
            }}
          />
        )}
      </div>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    product: state.product,
  };
};

export default connect(mapStateToProps, { CreateItem })(Sell);
