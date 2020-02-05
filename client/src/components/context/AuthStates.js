import React, { useState } from "react";
import AuthContext from "./AuthContext";
import * as firebase from "firebase";
import Materials from "./TEMPjson/mats.json";
import Hardwares from "./TEMPjson/haws.json";
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
  const [ordersForAnalytics, setOrdersForAnalytics] = useState(null);
  const [ordersWaiting, setOrdersWaiting] = useState(null);
  const [ordersShipped, setOrdersShipped] = useState(null);
  const [displayedList, setDisplayedList] = useState(null);
  const [focusedOrder, setFocusedOrder] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  /* shop */
  const [materials, setMaterials] = useState(null);
  const [hardwares, setHardwares] = useState(null);
  const [searchRes, setSearchRes] = useState(null);
  const [sortedHaws, setSortedHaws] = useState(null);
  const [displayedHaws, setDisplayedHaws] = useState(null);

  /* chart */
  const [destroy, setDestroy] = useState(false);
  const [activeSet, setActiveSet] = useState(null);
  const [yearly, setYearly] = useState(false);

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
        if (auth.currentUser.uid) {
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
    if (auth.currentUser.uid) {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .get()
        .then(doc => {
          const userData = doc.data();
          if (userData.admin === true) {
            const userObj = {
              email: userData.email,
              fullName: userData.fullName,
              admin: true
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

  const getOrders = async refreshing => {
    let orders;
    if (auth.currentUser.uid && user.admin)
      await db
        .collection("orders")
        .doc("ordersList")
        .get()
        .then(doc => {
          const data = doc.data();
          const waiting = data.waiting;
          const shipped = data.shipped;
          let all = [];
          for (var i = 0; i < waiting.length; i++) {
            all.push(waiting[i]);
          }
          for (var j = 0; j < shipped.length; j++) {
            all.push(shipped[j]);
          }
          if (refreshing) {
            orders = all;
          } else {
            setOrders([...all]);
            setOrdersShipped(shipped);
            setOrdersWaiting(waiting);
            setOrdersForAnalytics([...all]);
            initializeDisplayedList([...all]);
          }
        });
    return orders;
  };

  /* Orders management */
  const isOrder1Recent = (order1, order2) => {
    return order1.customId > order2.customId;
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
    setDisplayedList(null);
  };

  const setToShipped = order => {
    const orderId = order.id;
    const userId = order.uid;

    if (auth.currentUser.uid && user.admin) {
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

          // find order in waiting list
          db.collection("orders")
            .doc("ordersList")
            .get()
            .then(doc => {
              let data = doc.data();
              let waiting = data["waiting"];
              let shipped = data["shipped"];
              let order;
              for (var e = 0; e < waiting.length; e++) {
                if (waiting[e].id === orderId) {
                  waiting[e].order_status = "Livré";
                  order = waiting[e];
                  waiting.splice(e, 1);
                  shipped.push(order);
                  break;
                }
              }
              // update the documents
              db.collection("orders")
                .doc("ordersList")
                .update({
                  ["waiting"]: waiting,
                  ["shipped"]: shipped
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
              /* update shipped orders list */
              let shipped = [...ordersShipped];
              shipped.push(newOrders[i]);
              setOrdersShipped(shipped);
              /* update waiting orders list */
              let waiting = [...ordersWaiting];
              if (waiting.length === 0) {
                waiting.push(newOrders[i]);
              } else {
                for (var e = 0; e < waiting.length; e++) {
                  if (waiting[e].id === orderId) {
                    waiting.splice(e, 1);
                    setOrdersWaiting(waiting);
                  }
                }
              }
              break;
            }
          }
        })
        .catch(err => {
          alert("Une erreur s'est produite.", err);
        });
    }
  };

  const getMaterials = () => {
    if (auth.currentUser.uid && user.admin) {
      db.collection("shop")
        .doc("materialsList")
        .get()
        .then(doc => {
          const data = doc.data();
          setMaterials(data.materials);
        });
    }
  };

  const editMaterial = (name, origin, type, price, id) => {
    if (auth.currentUser.uid && user.admin) {
      let newMaterials;
      db.collection("shop")
        .doc("materialsList")
        .get()
        .then(doc => {
          let data = doc.data().materials;
          for (var i = 0; i < data.length; i++) {
            if (data[i]._id === id) {
              data[i].name = name;
              data[i].origin = origin;
              data[i].type = type;
              data[i].price = price;
              break;
            }
          }
          newMaterials = data;
          db.collection("shop")
            .doc("materialsList")
            .update({
              materials: data
            });
        })
        .then(() => {
          setMaterials(newMaterials);
        });
    }
  };

  const addNewItem = obj => {
    if (auth.currentUser.uid && user.admin) {
      let oldMats = [...materials];
      oldMats.unshift(obj);
      setMaterials(oldMats);

      db.collection("shop")
        .doc("materialsList")
        .get()
        .then(doc => {
          let data = doc.data().materials;
          data.unshift(obj);
          db.collection("shop")
            .doc("materialsList")
            .update({
              materials: data
            });
        });
    }
  };

  const deleteItem = mat => {
    if (auth.currentUser.uid && user.admin) {
      let oldMats = [...materials];
      for (var i = 0; i < oldMats.length; i++) {
        if (oldMats[i]._id === mat._id) {
          oldMats.splice(i, 1);
          break;
        }
      }
      setMaterials(oldMats);

      db.collection("shop")
        .doc("materialsList")
        .get()
        .then(doc => {
          let data = doc.data().materials;

          for (var i = 0; i < data.length; i++) {
            if (data[i]._id === mat._id) {
              data.splice(i, 1);
              break;
            }
          }

          db.collection("shop")
            .doc("materialsList")
            .update({
              materials: data
            });
        });
    }
  };

  const getHardwares = () => {
    if (auth.currentUser.uid && user.admin) {
      db.collection("shop")
        .doc("hardwaresList")
        .get()
        .then(doc => {
          const data = doc.data();
          setDisplayedHaws(data.hardwares);
          sortHardwares(data.hardwares);
        });
    }
  };

  const sortHardwares = haws => {
    let byTypes = {};
    for (let i = 0; i < haws.length; i++) {
      if (byTypes[haws[i].type]) {
        byTypes[haws[i].type].push(haws[i]);
      } else {
        byTypes[haws[i].type] = [haws[i]];
      }
    }
    setHardwares(byTypes);
    setSortedHaws(Object.entries(byTypes));
  };

  const editHardware = (type, color, price, id) => {
    if (auth.currentUser.uid && user.admin) {
      let newHardwares;
      db.collection("shop")
        .doc("hardwaresList")
        .get()
        .then(doc => {
          let data = doc.data().hardwares;
          for (var i = 0; i < data.length; i++) {
            if (data[i]._id === id) {
              data[i].type = type;
              data[i].color = color;
              data[i].price = price;
              break;
            }
          }
          newHardwares = data;
          db.collection("shop")
            .doc("hardwaresList")
            .update({
              hardwares: data
            });
        })
        .then(() => {
          setHardwares(newHardwares);
        });
    }
  };

  const deleteHaw = haw => {
    if (auth.currentUser.uid && user.admin) {
      let oldHaws = [...hardwares];
      for (var i = 0; i < oldHaws.length; i++) {
        if (oldHaws[i]._id === haw._id) {
          oldHaws.splice(i, 1);
          break;
        }
      }
      setHardwares(oldHaws);

      db.collection("shop")
        .doc("hardwaresList")
        .get()
        .then(doc => {
          let data = doc.data().hardwares;

          for (var i = 0; i < data.length; i++) {
            if (data[i]._id === haw._id) {
              data.splice(i, 1);
              break;
            }
          }

          db.collection("shop")
            .doc("hardwaresList")
            .update({
              hardwares: data
            });
        });
    }
  };

  const addNewHaw = obj => {
    if (auth.currentUser.uid && user.admin) {
      let byTypes = hardwares;
      if (byTypes[obj.type]) {
        byTypes[obj.type].push(obj);
      } else {
        byTypes[obj.type] = [obj];
      }
      setHardwares(byTypes);

      db.collection("shop")
        .doc("hardwaresList")
        .get()
        .then(doc => {
          let data = doc.data().hardwares;
          data.unshift(obj);
          db.collection("shop")
            .doc("hardwaresList")
            .update({
              hardwares: data
            });
        });
    }
  };

  const getAnalytics = () => {
    if (auth.currentUser.uid && user.admin) {
      db.collection("orders")
        .doc("analytics")
        .get()
        .then(doc => {
          let data = doc.data();
          setAnalytics(data);
        });
    }
  };

  const search = value => {
    const parsedVal = value.toLowerCase();
    db.collection("shop")
      .doc("materialsList")
      .get()
      .then(doc => {
        let data = doc.data().materials;
        for (let i = 0; i < data.length; i++) {
          if (
            data[i].name.toLowerCase() === parsedVal ||
            data[i].tag === parsedVal
          ) {
            setSearchRes(data[i]);
            break;
          }
        }
      });
  };

  const searchOrder = value => {
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].customId - 100000000 === value) {
        setFocusedOrder(orders[i]);
      }
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
        focusedOrder: [focusedOrder, setFocusedOrder],
        materials: [materials, setMaterials],
        hardwares: [hardwares, setHardwares],
        getMaterials: getMaterials,
        getHardwares: getHardwares,
        editMaterial: editMaterial,
        addNewItem: addNewItem,
        deleteItem: deleteItem,
        editHardware: editHardware,
        deleteHaw: deleteHaw,
        addNewHaw: addNewHaw,
        ordersForAnalytics: [ordersForAnalytics, setOrdersForAnalytics],
        analytics: [analytics, setAnalytics],
        getAnalytics: getAnalytics,
        search: search,
        searchRes: [searchRes, setSearchRes],
        destroy: [destroy, setDestroy],
        activeSet: [activeSet, setActiveSet],
        yearly: [yearly, setYearly],
        sortedHaws: [sortedHaws, setSortedHaws],
        displayedHaws: [displayedHaws, setDisplayedHaws],
        searchOrder: searchOrder
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthStates;
