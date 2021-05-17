import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Info from 'components/Typography/Info';


const useStyles = makeStyles({
  root: {
    Width: "100%",
    margin: "20px auto",
  },
  media: {
    height: 140,
  },
});

export default function EventCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={props.im}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">

            {props.name}
           
          </Typography>
          
        </CardContent>
      </CardActionArea>
      
    </Card>
  );
}