import React, { useEffect, useRef } from "react";

import lottie from "lottie-web";
import easyDifficultyAnimationData from "../../assets/animations/DifficultyAnimations/EasyDifficultyAnimation/EasyDifficultyAnimation.json";
import mediumDifficultyAnimationData from "../../assets/animations/DifficultyAnimations/MediumDifficultyAnimation/MediumDifficultyAnimation.json";
import hardDifficultyAnimationData from "../../assets/animations/DifficultyAnimations/HardDifficultyAnimation/HardDifficultyAnimation.json";

import "./DifficultySelectionModal.css";

import Button from "../Button/Button.js";

const DifficultySelectionModal = ({
  handleNewGame,
  easyMaxEmptyCells,
  mediumMaxEmptyCells,
  hardMaxEmptyCells
}) => {
  
  console.log("rendering....");
  const bodyContainer = useRef(null);

  // Use Effect for the animation
  useEffect(() => {
    let defaultOptions = { renderer: "svg", loop: true, autoplay: true };

    // Easy Difficulty Animation
    let easyDifficultyAnimationContainer = document.getElementById(
      "easyDifficultyAnimation"
    );
    const easyDifficultyAnimation = lottie.loadAnimation({
      container: easyDifficultyAnimationContainer,
      animationData: easyDifficultyAnimationData,
      ...defaultOptions,
    });

    // Medium Difficulty Animation
    let mediumDifficultyAnimationContainer = document.getElementById(
      "mediumDifficultyAnimation"
    );
    const mediumDifficultyAnimation = lottie.loadAnimation({
      container: mediumDifficultyAnimationContainer,
      animationData: mediumDifficultyAnimationData,
      ...defaultOptions,
    });

    // Hard Difficulty Animation
    let hardDifficultyAnimationContainer = document.getElementById(
      "hardDifficultyAnimation"
    );
    const hardDifficultyAnimation = lottie.loadAnimation({
      container: hardDifficultyAnimationContainer,
      animationData: hardDifficultyAnimationData,
      ...defaultOptions,
    });

    bodyContainer.current.style.visibility = 'visible';

    return () => {
      easyDifficultyAnimation.destroy();
      mediumDifficultyAnimation.destroy();
      hardDifficultyAnimation.destroy();
    }; // Clean up function
  }, []);


  return (
    <div ref={bodyContainer}>
          <Button
              onClick={() => handleNewGame(easyMaxEmptyCells)}
              buttonStyle="btn--primary--solid"
              text="Easy"
            />
          <Button
              onClick={() => handleNewGame(mediumMaxEmptyCells)}
              buttonStyle="btn--primary--solid"
              text="Medium"
            />
          <Button
              onClick={() => handleNewGame(hardMaxEmptyCells)}
              buttonStyle="btn--primary--solid"
              text="Hard"
            />
        </div>
  );
};

export default DifficultySelectionModal;
