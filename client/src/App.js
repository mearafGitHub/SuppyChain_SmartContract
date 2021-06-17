import React, { Component } from "react";
import Item from "./contracts/Item.json";
import ItemManager from "./contracts/ItemManager.json";

import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { price: 0, itemName: "Default Item", ladded: false};

  componentDidMount = async () => {
    try {
      this.web3 = await getWeb3();
      this.accounts = await web3.eth.getAccounts();
      this.networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      this.itemManager = new web3.eth.Contract(
        ItemManager.abi,
        ItemManager.networks[networkId] && ItemManager.networks[networkId].address
      );
      this.item = new web3.eth.Contract(
        Item.abi,
        Item.networks[netqorkId] && Item.networks[networkId].address
      );
      this.listenToPaymentEvent();
      this.setState({ladded: true});
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  listenToPaymentEvent = () => {
    let self = this;
    this.itemManager.events.SupplyChainStep().on("data", async function(the_event) {
    if(the_event.returnValues._step == 1) {
    let item = await self.itemManager.methods.items(the_event.returnValues._itemIndex).call();
    console.log(item);
    alert("Item " + item._identifier + " is just sold, deliver it now!");
    };
    console.log(the_event);
    });
  }

  handleSubmit = async () => {
    const { price, itemName } = this.state;
    console.log(itemName, cost, this.itemManager);
    let result = await this.itemManager.methods.createItem(itemName, price).send({ from: this.accounts[0] });
    console.log(result);
    alert("Send "+price+" Wei to "+result.events.SupplyChainStep.returnValues._address);
  };
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Simply Payment/Supply Chain Example!</h1>
        <h2>Items</h2>
        <h2>Add Element</h2>
        <div class="item_name">
          Item Name: <input type="text" name="itemName" value={this.state.itemName} onChange={this.handleInputChange} />
        </div>
        <div class="price">
          Cost: <input type="text" name="cost" value={this.state.cost} onChange={this.handleInputChange} />
        </div>
        <button class="create_btn" type="button" onClick={this.handleSubmit}>Create new Item</button>
      </div>
    );
}

export default App;
