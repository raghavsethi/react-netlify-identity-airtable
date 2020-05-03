import React from "react";
import netlifyIdentity from "netlify-identity-widget";

export default function Profile() {
  const user = netlifyIdentity.currentUser();
  console.log({ user });
  return (
    <div>
      <h3>User Profile</h3>
      {Object.keys(user.user_metadata.userProfile).map(key => {
        return (
          <div key={"profile-" + key}>
            <strong>{key}</strong>
            {": "}
            {user.user_metadata.userProfile[key]}
          </div>
        );
      })}
    </div>
  );
}
