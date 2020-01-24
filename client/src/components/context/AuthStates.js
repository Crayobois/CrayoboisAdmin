import React, { useState } from "react";
import AuthContext from "./AuthContext";
import * as firebase from "firebase";
//const uuidv4 = require("uuid/v4");

const AuthStates = props => {
  const [initializedFirebase, setInitializedFirebase] = useState(null);
  const [caughtErr, setCaughtErr] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recentStatusChange, setRecentStatusChange] = useState(false);

  /* orders management */
  const [orders, setOrders] = useState(null);
  const [ordersWaiting, setOrdersWaiting] = useState(null);
  const [ordersShipped, setOrdersShipped] = useState(null);
  const [displayedList, setDisplayedList] = useState(null);
  const [focusedOrder, setFocusedOrder] = useState(null);

  // firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyBccRjBkjdgTdVxFQwKvrbpUCGCMeVryAA",
    authDomain: "crayobois-fe722.firebaseapp.com",
    databaseURL: "https://crayobois-fe722.firebaseio.com",
    projectId: "crayobois-fe722",
    appId: "1:410478848299:web:b2f130cd32dba774fcbd6e",
    measurementId: "G-XHQN6JX1WG"
  };

  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    setInitializedFirebase(true);
  }

  // make auth and firestore references
  const auth = firebase.auth();
  const db = firebase.firestore();
  const [isAuth, setIsAuth] = useState(auth.currentUser);

  // check login status
  const checkIfLoggedIn = () => {
    return new Promise(resolve => {
      auth.onAuthStateChanged(resolve);
    });
  };

  // signout user
  const signout = () => {
    auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    setOrders(null);
    setOrdersShipped(null);
    setOrdersWaiting(null);
    setDisplayedList(null);
  };

  // signin user
  const signin = (email, password) => {
    setLoading(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then(cred => {
        if (auth.currentUser !== null) {
          db.collection("users")
            .doc(auth.currentUser.uid)
            .get()
            .then(doc => {
              const userData = doc.data();
              if (userData.admin === true) {
                setCaughtErr(false);
                setErrorMsg(null);
                // initialize session
                getUser();

                //ui update here
                const signinForm = document.querySelector("#signin-form");
                signinForm.reset();
                setIsLoggedIn(true);
              } else {
                signout();
                setLoading(false);
                setCaughtErr(true);
                setErrorMsg("L'accès vous a été refusé.");
              }
            });
        }
      })
      .catch(err => {
        setLoading(false);
        setCaughtErr(true);
        setErrorMsg("L'accès vous a été refusée.");
      });
  };

  const getUser = () => {
    setLoading(true);
    if (auth.currentUser) {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .get()
        .then(doc => {
          const userData = doc.data();
          if (userData.admin === true) {
            const userObj = {
              email: userData.email,
              fullName: userData.fullName
            };
            setUser(userObj);
            setLoading(false);
          } else {
            setLoading(false);
            return null;
          }
        });
    } else {
      return null;
    }
  };

  const getOrders = () => {
    if (auth.currentUser)
      db.collection("orders")
        .doc("ordersList")
        .get()
        .then(doc => {
          const data = doc.data();
          setOrders([...data["list"]]);
          initializeDisplayedList([...data["list"]]);
        });
  };

  /* Orders management */
  const isOrder1Recent = (order1, order2) => {
    return order1.customId > order2.customId;
  };

  const sortOrdersByType = orders => {
    let shipped = [];
    let waiting = [];

    /* Itirate through orders and sorting them */
    for (var i = 0; i < orders.length; i++) {
      if (orders[i].order_status !== "Livré") {
        waiting.push(orders[i]);
      } else {
        shipped.push(orders[i]);
      }
    }
    setOrdersShipped(shipped);
    setOrdersWaiting(waiting);
  };

  const sortOrdersByCreateTime = (collection, order) => {
    if (order === "recent") {
      /* sort collection */
      for (var i = 0; i < collection.length; i++) {
        for (var e = 0; e < collection.length - 1; e++) {
          const comparaison = isOrder1Recent(collection[e], collection[e + 1]);
          if (comparaison === false) {
            const recent = collection[e + 1];
            const old = collection[e];
            collection[e] = recent;
            collection[e + 1] = old;
          }
        }
      }
    } else {
      /* sort collection */
      for (var i = 0; i < collection.length; i++) {
        for (var e = 0; e < collection.length - 1; e++) {
          const comparaison = isOrder1Recent(collection[e], collection[e + 1]);
          if (comparaison === true) {
            const old = collection[e + 1];
            const recent = collection[e];
            collection[e] = old;
            collection[e + 1] = recent;
          }
        }
      }
    }
    setDisplayedList([...collection]);
    return collection;
  };

  const initializeDisplayedList = orders => {
    sortOrdersByType(orders);
    setDisplayedList(sortOrdersByCreateTime(orders, "recent"));
  };

  const generateNewList = (state, order) => {
    let collection;
    if (state === "*") {
      collection = [...orders];
    } else if (state === "waiting") {
      collection = ordersWaiting;
    } else {
      collection = ordersShipped;
    }

    sortOrdersByCreateTime(collection, order);
  };

  const resetDisplayedList = () => {
    setDisplayedList(sortOrdersByCreateTime(orders, "recent"));
  };

  const setToShipped = order => {
    const orderId = order.id;
    const userId = order.uid;

    if (auth.currentUser) {
      db.collection("users")
        .doc(userId)
        .get()
        .then(doc => {
          const data = doc.data();
          let orders = data.orders;
          // find order to update
          for (var i = 0; i < orders.length; i++) {
            if (orders[i].id === orderId) {
              orders[i].order_status = "Livré";
              break;
            }
          }

          // update user data
          db.collection("users")
            .doc(userId)
            .update({
              ["orders"]: orders
            });

          // find order in orders list
          db.collection("orders")
            .doc("ordersList")
            .get()
            .then(doc => {
              let data = doc.data();
              let list = data["list"];
              for (var e = 0; e < list.length; e++) {
                if (list[e].id === orderId) {
                  list[e].order_status = "Livré";
                  break;
                }
              }
              // update that order
              db.collection("orders")
                .doc("ordersList")
                .update({
                  ["list"]: list
                });
            });
        })
        .then(() => {
          setDisplayedList(null);
        })
        .then(() => {
          setFocusedOrder(null);
          // replace the current list
          let newOrders = [...displayedList];
          for (var i = 0; i < displayedList.length; i++) {
            if (newOrders[i].id === orderId) {
              newOrders[i].order_status = "Livré";
              setDisplayedList([...newOrders]);
              sortOrdersByType([...newOrders]);
              break;
            }
          }
        });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signin: signin,
        signout: signout,
        initializedFirebase: [initializedFirebase, setInitializedFirebase],
        isAuth: [isAuth, setIsAuth],
        caughtErr: [caughtErr, setCaughtErr],
        errorMsg: [errorMsg, setErrorMsg],
        getUser: getUser,
        user: [user, setUser],
        isLoggedIn: isLoggedIn,
        loading: [loading, setLoading],
        checkIfLoggedIn: checkIfLoggedIn,
        getOrders: getOrders,
        generateNewList: generateNewList,
        displayedList: [displayedList, setDisplayedList],
        resetDisplayedList: resetDisplayedList,
        setToShipped: setToShipped,
        recentStatusChange: [recentStatusChange, setRecentStatusChange],
        focusedOrder: [focusedOrder, setFocusedOrder]
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthStates;
