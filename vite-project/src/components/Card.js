import React, { useEffect, useState } from "react";
import CardItem from "../components/CardItem";
import "../components/Cards.css";
import axios from "axios";
import { FixedSizeGrid as Grid } from "react-window";

// const {MongoClient} = require("mongodb");

function Card({maxBedrooms, setMaxBedrooms, maxPrice, setMaxPrice }) {
  const [apartments, setApartments] = useState([]);
  const [nbAppartement, setNbAppartement] = useState();
  const APPART_URL = "http://localhost:4000/appartments";

  useEffect(() => {
    /**
     * méthode qui fetch le backend API qui contient les
     * data des appartements
     */
    const axiosFetchData = async () => {
      try {
        // Fetch data using Axios
        const response = await axios.get(APPART_URL);
        // Set fetched data into state
        setApartments(response.data);
      } catch (error) {
        console.error("Error fetching apartment data:", error);
      }
    };
    axiosFetchData();
  }, []);

  const CardCell = ({ columnIndex, rowIndex, style }) => {
    //Calculate the index using row and column indices
    const index = rowIndex * 3 + columnIndex; // 3 columns per row

    if (index >= apartments.length) return null; // prevent out-of bounce errors

    if(apartments[index].price > maxPrice) return null;
    console.log()
    console.log("maxprice:",maxPrice)

    if(apartments[index].bedrooms > maxBedrooms ) return null


    const { price, title, img, url } = apartments[index];

    return (
      <div style={style}>
        
        {/**<text>Index: {index}</text>
        <text>bedrooms: {apartments[index].bedrooms}</text>
    <text>maxBedrooms: {maxBedrooms}</text>**/}
        


        <CardItem
         src={img}
         text={`${price}$ ${title}`}
          path={url}
         label="Facebook"
        />


      </div>
    );
  };

  const ApartmentGrid = () => {
    if (w >= 960) {
      return (
        <Grid
          columnCount={1}
          rowCount={Math.ceil(apartments.length / 3)} //Number of rows needed
          columnWidth={450}
          height={900}
          rowHeight={400}
          width={500}
        >
          {CardCell}
        </Grid>
      );
    } else {
      return (
        <Grid
          columnCount={1}
          rowCount={Math.ceil(apartments.length / 1)} //Number of rows needed
          columnWidth={350}
          height={900}
          rowHeight={350}
          width={350}
        >
          {CardCell}
        </Grid>
      );
    }
  };
  /**
   * méthode qui permet de savoir la taille de la fenetre à tout moment
   */
  const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
      // Fonction pour mettre à jour le state lorsque la fenêtre est redimensionnée
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      //ajouter un gestionnaire d'évènement pour resizd
      window.addEventListener("resize", handleResize);

      // Supprimer le gestionnaire d'événements au nettoyage
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    });
    return windowWidth;
  };

  const w = useWindowWidth();
  return (
    <div className="cards">
      <h1> {apartments.length} Résultats</h1>
      <div className="cards__container">
        <div className="cards__wrapper">
          <div className="cards__item">
            <ApartmentGrid />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
