import Bool "mo:base/Bool";
import Func "mo:base/Func";
import Text "mo:base/Text";

import Nat "mo:base/Nat";
import Array "mo:base/Array";

actor {

  // Define the Item type
  type Item = {
    id: Nat;
    text: Text;
    completed: Bool;
  };

  // Stable variable to store the list of items
  stable var items : [Item] = [];

  // Stable variable to keep track of the next item ID
  stable var nextItemId : Nat = 0;

  // Function to add a new item
  public func addItem(text: Text) : async Nat {
    let newItem : Item = {
      id = nextItemId;
      text = text;
      completed = false;
    };
    items := Array.append(items, [newItem]);
    nextItemId += 1;
    return newItem.id;
  };

  // Function to mark an item as completed
  public func markItemCompleted(id: Nat) : async Bool {
    var found = false;
    items := Array.map<Item, Item>(items, func(item) {
      if (item.id == id) {
        found := true;
        { id = item.id; text = item.text; completed = true };
      } else {
        item;
      }
    });
    return found;
  };

  // Function to delete an item
  public func deleteItem(id: Nat) : async Bool {
    let originalLength = items.size();
    items := Array.filter<Item>(items, func(item) {
      item.id != id
    });
    return items.size() < originalLength;
  };

  // Function to get all items
  public query func getItems() : async [Item] {
    return items;
  };
}
