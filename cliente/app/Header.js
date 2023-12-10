import Link from "next/link";
import React from "react";

import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const { data } = useSession();
  console.log(useSession())



  return (
    <nav className="navbar navbar-light bg-light row justify-content-center sticky-top">
      <div className="container">
        <div className="col-3 p-0">
          <a className="navbar-brand" style={{ marginLeft: "20px" }} href="/mainmatch">
            Papita Match
          </a>
        </div>

        <div className="col-3 mt-3 mt-md-0 text-center d-flex flex-row">
          {data?.user ? (
            <>
              <span style={{ marginRight: "15px" }}>
                {typeof data?.user?.image == "string" ?(<img
                  src={data?.user?.image}
                  height="25"
                  width="25"
                  alt="user image"
                />):(<img
                  src={data?.user?.image.foto}
                  height="25"
                  width="25"
                  alt="user image"/>)}
                
                {data?.user?.name}
              </span>

              <span style={{ cursor: "pointer" }} onClick={() => signOut()}>
                {" "}
                Logout
              </span>
            </>
          ) : (
            <span style={{ marginRight: "15px" }}>
              {" "}
              <Link className="nav-link" href="/login">
                Iniciar Sesion
              </Link>
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
