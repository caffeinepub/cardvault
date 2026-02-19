import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  type BusinessCard = {
    fullName : Text;
    title : Text;
    phone : Text;
    email : Text;
    website : Text;
    bio : Text;
  };

  type SavedContent = {
    id : Text;
    content : Text;
    contentType : ContentType;
    linkTitle : Text;
  };

  type ContentType = {
    #bookmark;
    #general;
  };

  type Idea = {
    id : Text;
    content : Text;
    createdAt : Time.Time;
  };

  type Reminder = {
    id : Text;
    content : Text;
    dueDate : ?Time.Time;
    completed : Bool;
    createdAt : Time.Time;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let businessCards = Map.empty<Principal, BusinessCard>();
  let savedContent = Map.empty<Principal, Map.Map<Text, SavedContent>>();
  let ideas = Map.empty<Principal, Map.Map<Text, Idea>>();
  let reminders = Map.empty<Principal, Map.Map<Text, Reminder>>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Business Card Functions
  func getUserSavedContent(caller : Principal) : Map.Map<Text, SavedContent> {
    switch (savedContent.get(caller)) {
      case (null) { Map.empty<Text, SavedContent>() };
      case (?content) { content };
    };
  };

  public shared ({ caller }) func saveBusinessCard(card : BusinessCard) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save business cards");
    };
    businessCards.add(caller, card);
  };

  public query ({ caller }) func getBusinessCard() : async ?BusinessCard {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access business cards");
    };
    businessCards.get(caller);
  };

  // Allow unauthenticated retrieval of other users' business cards
  public query func getBusinessCardByPrincipal(principal : Principal) : async ?BusinessCard {
    businessCards.get(principal);
  };

  // Saved Content Functions
  public shared ({ caller }) func createSavedContent(content : SavedContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create saved content");
    };
    let userContent = getUserSavedContent(caller);
    userContent.add(content.id, content);
    savedContent.add(caller, userContent);
  };

  public query ({ caller }) func readSavedContent(id : Text) : async ?SavedContent {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can read saved content");
    };
    getUserSavedContent(caller).get(id);
  };

  public shared ({ caller }) func updateSavedContent(id : Text, content : SavedContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update saved content");
    };
    let userContent = getUserSavedContent(caller);
    if (not userContent.containsKey(id)) {
      Runtime.trap("Content not found");
    };
    userContent.add(id, content);
    savedContent.add(caller, userContent);
  };

  public shared ({ caller }) func deleteSavedContent(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete saved content");
    };
    let userContent = getUserSavedContent(caller);
    if (not userContent.containsKey(id)) {
      Runtime.trap("Content not found");
    };
    userContent.remove(id);
    savedContent.add(caller, userContent);
  };

  public query ({ caller }) func listSavedContent() : async [SavedContent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list saved content");
    };
    getUserSavedContent(caller).values().toArray();
  };

  // Ideas Functions
  func getUserIdeas(caller : Principal) : Map.Map<Text, Idea> {
    switch (ideas.get(caller)) {
      case (null) { Map.empty<Text, Idea>() };
      case (?userIdeas) { userIdeas };
    };
  };

  public shared ({ caller }) func createIdea(id : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create ideas");
    };
    let userIdeas = getUserIdeas(caller);
    if (userIdeas.containsKey(id)) {
      Runtime.trap("Idea already exists");
    };
    let idea : Idea = {
      id;
      content;
      createdAt = Time.now();
    };
    userIdeas.add(id, idea);
    ideas.add(caller, userIdeas);
  };

  public query ({ caller }) func readIdea(id : Text) : async ?Idea {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can read ideas");
    };
    getUserIdeas(caller).get(id);
  };

  public shared ({ caller }) func updateIdea(id : Text, newContent : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update ideas");
    };
    let userIdeas = getUserIdeas(caller);
    switch (userIdeas.get(id)) {
      case (null) {
        Runtime.trap("Idea not found");
      };
      case (?idea) {
        let updatedIdea = {
          id = idea.id;
          content = newContent;
          createdAt = idea.createdAt;
        };
        userIdeas.add(id, updatedIdea);
        ideas.add(caller, userIdeas);
      };
    };
  };

  public shared ({ caller }) func deleteIdea(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete ideas");
    };
    let userIdeas = getUserIdeas(caller);
    if (not userIdeas.containsKey(id)) {
      Runtime.trap("Idea not found");
    };
    userIdeas.remove(id);
    ideas.add(caller, userIdeas);
  };

  public query ({ caller }) func listIdeas() : async [Idea] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list ideas");
    };
    getUserIdeas(caller).values().toArray();
  };

  // Reminders Functions
  func getUserReminders(caller : Principal) : Map.Map<Text, Reminder> {
    switch (reminders.get(caller)) {
      case (null) { Map.empty<Text, Reminder>() };
      case (?userReminders) { userReminders };
    };
  };

  public shared ({ caller }) func createReminder(reminder : Reminder) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create reminders");
    };
    let userReminders = getUserReminders(caller);
    if (userReminders.containsKey(reminder.id)) {
      Runtime.trap("Reminder already exists");
    };
    userReminders.add(reminder.id, reminder);
    reminders.add(caller, userReminders);
  };

  public query ({ caller }) func readReminder(id : Text) : async ?Reminder {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can read reminders");
    };
    getUserReminders(caller).get(id);
  };

  public shared ({ caller }) func updateReminder(id : Text, updatedReminder : Reminder) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update reminders");
    };
    let userReminders = getUserReminders(caller);
    if (not userReminders.containsKey(id)) {
      Runtime.trap("Reminder not found");
    };
    userReminders.add(id, updatedReminder);
    reminders.add(caller, userReminders);
  };

  public shared ({ caller }) func deleteReminder(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete reminders");
    };
    let userReminders = getUserReminders(caller);
    if (not userReminders.containsKey(id)) {
      Runtime.trap("Reminder not found");
    };
    userReminders.remove(id);
    reminders.add(caller, userReminders);
  };

  public shared ({ caller }) func getUpcomingReminders() : async [Reminder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get upcoming reminders");
    };
    getUserReminders(caller).values().toArray();
  };
};
