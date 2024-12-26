import React, { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [isBillFormVisible, setBillFormVisible] = useState(false);

  const [friendSelected, setFriendSelected] = useState(null);

  return (
    <>
      <h1
        style={{ margin: "4rem auto", fontSize: "3rem", textAlign: "center" }}
      >
        Eat 'n Split
      </h1>
      <div className="app">
        <div className="sidebar">
          <FriendList
            friends={friends}
            setFriends={setFriends}
            friendSelected={friendSelected}
            setFriendSelected={setFriendSelected}
            setBillFormVisible={setBillFormVisible}
          />
        </div>
        {isBillFormVisible && (
          <BillFormElement
            friends={friends}
            setFriends={setFriends}
            friendSelected={friendSelected}
            setBillFormVisible={setBillFormVisible}
          />
        )}
      </div>
    </>
  );
}

function FriendList({
  friends,
  setFriends,
  setBillFormVisible,
  setFriendSelected,
  friendSelected,
}) {
  const [isAddFriendFormVisible, setAddFriendFormVisible] = useState(false);

  return (
    <>
      <ul>
        {friends.map((friend) => (
          <li>
            <img src={friend.image} alt={friend.name} />
            <div>
              {friend.name}
              <br />
              {friend.balance === 0 ? (
                <span>You and {friend.name} are even</span>
              ) : (
                <span>
                  {friend.balance < 0 ? (
                    <span className="red">
                      You owe {friend.name} ${Math.abs(friend.balance)}
                    </span>
                  ) : (
                    <span className="green">
                      {friend.name} owes you ${friend.balance}
                    </span>
                  )}
                </span>
              )}
            </div>
            {friendSelected === friend ? (
              <button
                className="button"
                onClick={() => {
                  setBillFormVisible(false);
                  setFriendSelected(null);
                }}
              >
                Close
              </button>
            ) : (
              <button
                className="button"
                onClick={() => {
                  setBillFormVisible(true);
                  setFriendSelected(friend);
                }}
              >
                Select
              </button>
            )}
          </li>
        ))}
        {!isAddFriendFormVisible && (
          <button
            className="button"
            onClick={() => setAddFriendFormVisible(true)}
          >
            Add a friend
          </button>
        )}
      </ul>
      {isAddFriendFormVisible && (
        <AddFriendFormElement
          friends={friends}
          setFriends={setFriends}
          setAddFriendFormVisible={setAddFriendFormVisible}
        />
      )}
    </>
  );
}

function AddFriendFormElement({
  friends,
  setFriends,
  setAddFriendFormVisible,
}) {
  const [friendName, setFriendName] = useState("");
  const [friendImage, setFriendImage] = useState("");
  return (
    <div>
      <form className="form-add-friend">
        <label>🧑‍🤝‍🧑Friend name</label>
        <input type="text" onChange={(e) => setFriendName(e.target.value)} />
        {console.log(friendName)}
        <label>🌄Image URL</label>
        <input type="url" onChange={(e) => setFriendImage(e.target.value)} />
        <button
          className="button"
          onClick={() => {
            setFriends([
              ...friends,
              {
                id: Math.floor(Math.random() * 1000000),
                name: friendName,
                image: friendImage,
                balance: 0,
              },
            ]);
            setAddFriendFormVisible(false);
          }}
        >
          Add
        </button>
      </form>
      <button
        onClick={() => setAddFriendFormVisible(false)}
        style={{ float: "right" }}
        className="button"
      >
        Close
      </button>
    </div>
  );
}

function BillFormElement({
  friends,
  setFriends,
  friendSelected,
  setBillFormVisible,
}) {
  const [billValue, setBillValue] = useState(0);
  const [yourExpense, setYourExpense] = useState(0);
  const [friendExpense, setFriendExpense] = useState(0);
  const [whoPays, setWhoPays] = useState("You");
  const handleSplitBill = () => {
    let updatedFriends = friends.map((friend) => {
      if (friend === friendSelected) {
        return {
          ...friend,
          balance:
            whoPays === "You"
              ? friend.balance + parseInt(friendExpense)
              : friend.balance - parseInt(yourExpense),
        };
      }
      return friend;
    });
    console.log(updatedFriends);
    setFriends(updatedFriends);
    setBillFormVisible(false);
  };
  return (
    <div>
      <form className="form-split-bill">
        <h2>You are sharing bill with {friendSelected.name}</h2>
        <label>💵 Bill value</label>
        <input
          type="text"
          value={billValue}
          min="0"
          onChange={(e) => {
            parseInt(e.target.value) !== ""
              ? setBillValue(e.target.value)
              : setBillValue(0);
            setYourExpense(e.target.value / 2);
            setFriendExpense(e.target.value / 2);
          }}
        />
        <label>👨‍🦱Your expense</label>
        <input
          type="text"
          value={yourExpense}
          min="0"
          onChange={(e) => {
            if (parseInt(e.target.value) <= parseInt(billValue)) {
              console.log(billValue);
              parseInt(e.target.value) !== ""
                ? setYourExpense(e.target.value)
                : setYourExpense(0);
              yourExpense && setFriendExpense(billValue - e.target.value);
            }
          }}
        />
        <label>🧑‍🤝‍🧑Friend's expense</label>
        <input
          type="text"
          value={friendExpense}
          min="0"
          onChange={(e) => {
            if (parseInt(e.target.value) <= parseInt(billValue)) {
              parseInt(e.target.value) !== ""
                ? setFriendExpense(e.target.value)
                : setFriendExpense(0);

              friendExpense && setYourExpense(billValue - e.target.value);
            }
          }}
        />
        <label>🤑Who is paying the bill?</label>
        <select value={whoPays} onChange={(e) => setWhoPays(e.target.value)}>
          <option>You</option>
          <option>Friend</option>
        </select>
        <button className="button" onClick={handleSplitBill}>
          Split bill
        </button>
      </form>
    </div>
  );
}
