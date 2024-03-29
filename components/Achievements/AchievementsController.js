import * as React from "react";
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  where,
} from "firebase/firestore";
import {db} from '../../firebaseConfig';

function setDataForAchievement(
  achievDocs,
  numberOfAchiev
) {
  let returnString = "";
  achievDocs.forEach((achievDoc) => {
    if (
      Number(achievDoc.NoAchievement) == Number(numberOfAchiev) &&
      !achievDoc.isAvailable
    ) {
      returnString = achievDoc.id;
    }
  });
  return returnString;
}

const fetchData = async (dogID) => {
  const collectionRefBasic = collection(db, "Basic_exercise_inst");
  const queryBasic = query(collectionRefBasic, where("DogID", "==", dogID));
  const snapshotBasic = await getDocs(queryBasic);
  const basicSkills = snapshotBasic.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  const collectionRefAdvanced = collection(db, "Advanced_exercise_inst");
  const queryAdvanced = query(
    collectionRefAdvanced,
    where("DogID", "==", dogID)
  );
  const snapshotAdvanced = await getDocs(queryAdvanced);
  const advancedSkills = snapshotAdvanced.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  const collectionRefCustom = collection(db, "Custom_exercise");
  const queryCustom = query(collectionRefCustom, where("DogID", "==", dogID));
  const snapshotCustom = await getDocs(queryCustom);
  const customSkills = snapshotCustom.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  let maximumOfBasics = snapshotBasic.size;
  let completedBasics = 0;
  basicSkills.forEach((doc) => {
    if (doc.Points == doc.Max_points) {
      completedBasics += 1;
    }
  });

  let maximumOfAdvanced = snapshotAdvanced.size;
  let completedAdvanced = 0;
  advancedSkills.forEach((doc) => {
    if (doc.Points == doc.Max_points) {
      completedAdvanced += 1;
    }
  });

  let maximumOfCustoms = snapshotCustom.size;
  let completedCustoms = 0;
  customSkills.forEach((doc) => {
    if (doc.Points == doc.Max_points) {
      completedCustoms += 1;
    }
  });

  const collectionRefAchiev = collection(db, "Achievements_inst");
  const qAchiev = query(collectionRefAchiev, where("DogID", "==", dogID));
  const snapshotAchiev = await getDocs(qAchiev);
  const achievDoc = snapshotAchiev.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  let achievementsToUpdate = [];
  if (completedBasics == 1) {
    let achvID = setDataForAchievement(achievDoc, 1);
    if (achvID != "") {
      achievementsToUpdate.push(achvID);
    }
  }

  if (completedBasics == 2) {
    let achvID = setDataForAchievement(achievDoc, 2);
    if (achvID != "") {
      achievementsToUpdate.push(achvID);
    }
  }

  if (completedBasics == maximumOfBasics) {
    let achvID = setDataForAchievement(achievDoc, 3);
    if (achvID != "") {
      achievementsToUpdate.push(achvID);
    }
  }

  if (completedAdvanced == 1) {
    let achvID = setDataForAchievement(achievDoc, 4);
    if (achvID != "") {
      achievementsToUpdate.push(achvID);
    }
  }

  if (completedAdvanced == maximumOfAdvanced) {
    let achvID = setDataForAchievement(achievDoc, 5);
    if (achvID != "") {
      achievementsToUpdate.push(achvID);
    }
  }

  if (
    completedBasics == maximumOfBasics &&
    completedAdvanced == maximumOfAdvanced
  ) {
    let achvID = setDataForAchievement(achievDoc, 6);
    if (achvID != "") {
      achievementsToUpdate.push(achvID);
    }
  }

  if (maximumOfCustoms == 1) {
    let achvID = setDataForAchievement(achievDoc, 7);
    if (achvID != "") {
      achievementsToUpdate.push(achvID);
    }
  }

  if (maximumOfCustoms == 5) {
    let achvID = setDataForAchievement(achievDoc, 8);
    if (achvID != "") {
      achievementsToUpdate.push(achvID);
    }
  }

  if (
    maximumOfBasics == completedBasics &&
    maximumOfAdvanced == completedAdvanced &&
    maximumOfCustoms == completedCustoms
  ) {
    let achvID = setDataForAchievement( achievDoc, 9);
    if (achvID != "") {
      achievementsToUpdate.push(achvID);
    }
  }
  try {
    achievementsToUpdate.forEach(async (achvID) => {
      await updateDoc(doc(db, 'Achievements_inst', achvID), {
        isAvailable: true,
      }).catch((error) => {
        console.log("error: " + error);
      });
    });
  } catch (error) {
    console.log("error: " + error);
  }
};

export default function AchievementsController(dogID) {
  fetchData(dogID);
}
