import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/views/landingPageSections/workStyle.js";

const useStyles = makeStyles(styles);

export default function AboutSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem cs={12} sm={12} md={8}>
          <h2 className={classes.title}>About us</h2>
          <h4 className={classes.description}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas a ornare ante.
                      Donec viverra tempus dapibus. Aenean imperdiet gravida risus ac suscipit.
                      Fusce non nunc purus. Quisque consequat ac odio eget placerat. Morbi at justo a orci vestibulum convallis.
                      Donec ac sollicitudin elit. In purus mauris, finibus vel vulputate at, venenatis eget purus. Aenean neque magna, vehicula ut metus molestie, faucibus ullamcorper dolor.
                      Sed scelerisque odio vitae risus accumsan, ac commodo massa aliquet.

                      Sed interdum lobortis convallis. Phasellus sit amet orci id diam pulvinar luctus.
                      Integer gravida augue sed odio iaculis sagittis. Sed et eros finibus, imperdiet libero ac, blandit augue.
                      Aliquam interdum tortor id magna dignissim dignissim. Nullam ultricies pharetra porta. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed dapibus maximus eros sit amet tincidunt. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                      Proin luctus aliquet ex id commodo. Mauris sagittis blandit elit, nec faucibus odio luctus a. Morbi mattis libero id libero cursus, quis mollis leo ultrices.
                      Vivamus sit amet nunc justo. Vestibulum vitae mattis nunc. Suspendisse vitae mi gravida, facilisis ex vel, feugiat tellus.
                      Ut semper leo urna, in feugiat metus lobortis ut.
          </h4>
          
        </GridItem>
      </GridContainer>
    </div>
  );
}
