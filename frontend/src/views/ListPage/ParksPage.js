import React from "react";
import classNames from "classnames";

import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks";
import { makeStyles } from "@material-ui/core";
import styles from "assets/jss/material-kit-react/views/loginPage.js";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Parallax from "components/Parallax/Parallax";
import MediaCard from "components/Card/mediaCard";

const useStyles = makeStyles((theme)=>({
 main:{
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3"
 },
 mainRaised: {
    margin: "-60px 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  },

  container:{
    paddingRight: "15px",
    paddingLeft: "15px",
    marginRight: "auto",
    marginLeft: "auto",
    width: "100%",
    "@media (min-width: 576px)": {
        maxWidth: "540px"
      },
      "@media (min-width: 768px)": {
        maxWidth: "720px"
      },
      "@media (min-width: 992px)": {
        maxWidth: "960px"
      },
      "@media (min-width: 1200px)": {
        maxWidth: "1140px"
      }
  },
  margin20:{
      margin:"20px auto"
  }
}));
const top100Films=[
    {title:'foot',year:'1999'},
    {title:'tennis',year:'2000'},
    {title:'basketball',year:'2020'}
];

const ParksPage=(props)=>{
    const classes = useStyles();
  const { ...rest } = props;

    return(
        <div>
           <Header
        color="transparent"
        brand="KEEP FIT"
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white"
        }}
        {...rest}
      />
      <Parallax small filter image={require("assets/img/profile-bg.jpg")}  />
      <div className={classNames(classes.main ,classes.mainRaised)}>
          <div className={classes.container}>
      <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={6} lg={3}>
                    <Autocomplete
                            className={classes.margin20}
                            id="combo-box-demo"
                            options={top100Films}
                            getOptionLabel={(option) => option.title}
                            renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
                        />
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={3}>
                    <Autocomplete
                        className={classes.margin20}
                        id="combo-box-demo"
                        options={top100Films}
                        getOptionLabel={(option) => option.title}
                        renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
                    />
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={6}>
                    <Autocomplete
                        className={classes.margin20}
                        multiple
                        id="tags-outlined"
                        options={top100Films}
                        getOptionLabel={(option) => option.title}
                        defaultValue={[top100Films[2]]}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="filterSelectedOptions"
                                placeholder="Favorites"
                            />
                        )}
                    />
      </GridItem>
      </GridContainer>

      <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={6} lg={4}>
              <MediaCard/>
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={4}>
              <MediaCard/>
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={4}>
              <MediaCard/>
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={4}>
              <MediaCard/>
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={4}>
              <MediaCard/>
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={4}>
              <MediaCard/>
          </GridItem>
      </GridContainer>
      </div>
      </div>
        </div>
    )
}

export default ParksPage;