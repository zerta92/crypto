import React, { useRef, useEffect } from "react";
import Identicon from "identicon.js";
import "./App.css";
import { fromSmallestUnit, toSmallestUnit } from "./utils";
import { useGlobal } from "./context/GlobalProvider";

function Posts({ socialNetwork }) {
  const { account } = useGlobal();
  const [postCount, setPostCount] = React.useState(0);
  const postContentRef = useRef(null);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [posts, setPosts] = React.useState([]);

  const postBigIntToNumberKeys = ["tipAmount"];

  useEffect(() => {
    if (socialNetwork !== null) {
      loadPosts();
      setLoading(false);
    }
  }, [socialNetwork]);

  /* SocialNetwork */
  async function loadPosts() {
    const postCount = await socialNetwork.methods.postsCount().call();

    setPostCount(postCount);
    const allPosts = [];
    for (let i = 1; i <= postCount; i++) {
      const post = await socialNetwork.methods.posts(i).call();

      Object.keys(post).forEach((key) => {
        if (postBigIntToNumberKeys.includes(key)) {
          post[key] = Number(post[key]);
        }
      });

      const isInPosts = posts.find((post_) => post_.i === post.i);

      if (!isInPosts) {
        allPosts.push(post);
      }
    }
    setPosts(
      [...allPosts, ...posts]
        .filter((post) => !post.deleted)
        .sort((a, b) => b.tipAmount - a.tipAmount)
    );
  }

  function createPost(content) {
    setLoading(true);

    socialNetwork.methods
      .createPost(content)
      .send({ from: account })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log({ confirmationNumber });
      })
      .on("receipt", async (receipt) => {
        await loadPosts();
        setLoading(false);
      })
      .on("error", function (error) {
        setLoading(false);
        setError(true);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        setErrorMessage(err.message ?? "There was an error");
      });
  }

  function tipPost(id, tipAmount) {
    setLoading(true);
    socialNetwork.methods
      .tipPost(id)
      .send({ from: account, value: tipAmount })
      .on("confirmation", function (confirmationNumber, receipt) {})
      .on("receipt", (receipt) => {
        setLoading(false);
      })
      .on("error", function (error) {
        setLoading(false);
        setError(true);
      });
  }

  function deletePost(id) {
    setLoading(true);
    socialNetwork.methods
      .deletePost(id)
      .send({ from: account })
      .on("confirmation", function (confirmationNumber, receipt) {})
      .on("receipt", (receipt) => {
        setLoading(false);
        setPosts(
          posts.filter((post) => {
            return post.id !== +id;
          })
        );
      })
      .on("error", function (error) {
        setLoading(false);
        setError(true);
      });
  }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 ml-auto mr-auto"
          style={{ maxWidth: "500px" }}
        >
          <div className="content mr-auto ml-auto">
            <p>&nbsp;</p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const content = postContentRef.current.value;
                createPost(content);
              }}
            >
              <div className="form-group mr-sm-2">
                <input
                  id="postContent"
                  ref={postContentRef}
                  type="text"
                  className="form-control"
                  placeholder="What's on your mind?"
                  required
                />
              </div>
              {error && <p style={{ color: "red" }}>{errorMessage}</p>}
              <button type="submit" className="btn btn-primary btn-block">
                Share
              </button>
            </form>
            <p>&nbsp;</p>

            {posts.map((post, key) => {
              return (
                <div className="card mb-4" key={key}>
                  <div className="card-header">
                    <img
                      alt=""
                      className="mr-2"
                      width="30"
                      height="30"
                      src={`data:image/png;base64,${new Identicon(
                        post.author,
                        30
                      ).toString()}`}
                    />
                    {/* <small className="text-muted">{post.author}</small> */}
                  </div>
                  <ul id="postList" className="list-group list-group-flush">
                    <li className="list-group-item">
                      <p>{post.content}</p>
                    </li>
                    <li key={key} className="list-group-item py-2">
                      <small className="float-left mt-1 text-muted">
                        TIPS:{" "}
                        {fromSmallestUnit("eth", post.tipAmount.toString())} ETH
                      </small>
                      <button
                        className="btn btn-link btn-sm float-right pt-0"
                        name={post.id}
                        onClick={(event) => {
                          let tipAmount = toSmallestUnit("eth", "0.1");
                          tipPost(event.target.name, tipAmount);
                        }}
                      >
                        TIP 0.1 ETH
                      </button>
                      {account === post.author ? (
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={post.id}
                          onClick={(event) => {
                            deletePost(event.target.name);
                          }}
                        >
                          DELETE POST
                        </button>
                      ) : (
                        <div></div>
                      )}
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Posts;
