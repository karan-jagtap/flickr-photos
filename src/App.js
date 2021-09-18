import axios from "axios";
import React from "react";
import "./App.css";
import { saveAs } from "file-saver";

const API_KEY = "7be96cbff3d668aafc1237186e8affa9";
const TAGS = [
  "mountains",
  "bird",
  "fish",
  "mountains2",
  "bird2",
  "fish2",
  "mountains3",
  "bird3",
  "fish3",
  "mountains4",
  "bird4",
  "fish4",
];
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      displayData: [],
      recordsPerPage: 25,
      pageNumber: 1,
      totalPages: 1,
      tags: "",
      activeTagId: "clear",
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = (from = "default", tagsText) => {
    let URL = "";
    if (from === "default") {
      URL = ` https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${API_KEY}&extras=url_s&per_page=${this.state.recordsPerPage}&page=${this.state.pageNumber}&format=json&nojsoncallback=1`;
    } else {
      if (tagsText === "tags") {
        URL = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&tags=${this.state.tags}&extras=url_s&per_page=${this.state.recordsPerPage}&page=${this.state.pageNumber}&format=json&nojsoncallback=1`;
      } else {
        URL = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&text=${this.state.searchText}&extras=url_s&per_page=${this.state.recordsPerPage}&page=${this.state.pageNumber}&format=json&nojsoncallback=1`;
      }
    }
    axios
      .get(URL)
      .then((res) => {
        console.log("fetchDefaultData() - res - ", res);
        this.setState({
          displayData: res.data.photos.photo,
          totalPages: res.data.photos.pages,
        });
      })
      .catch((err) => {
        console.log("fetchDefaultData() - catch - ", err);
      });
  };

  onSearchTextChange = (e) => {
    this.setState({ searchText: e.target.value });
  };

  onRecordsChange = (e) => {
    e.preventDefault();
    const { value } = e.target;
    if (value !== this.state.recordsPerPage) {
      this.setState({ recordsPerPage: e.target.value, pageNumber: 1 }, () => {
        if (this.state.searchText === "" && this.state.tags === "") {
          this.fetchData();
        } else if (this.state.searchText !== "" && this.state.tags === "") {
          this.fetchData("search", "text");
        } else if (this.state.searchText === "" && this.state.tags !== "") {
          this.fetchData("search", "tags");
        }
      });
    }
  };

  onPageChange = (from) => {
    if (
      this.state.pageNumber + from > 0 &&
      this.state.pageNumber + from <= this.state.totalPages
    ) {
      this.setState(
        (prev) => ({ pageNumber: prev.pageNumber + from }),
        () => {
          console.log(
            "sach = ",
            this.state.searchText,
            "tahs = ",
            this.state.tags
          );
          if (this.state.searchText === "" && this.state.tags === "") {
            this.fetchData();
          } else if (this.state.searchText !== "" && this.state.tags === "") {
            this.fetchData("search", "text");
          } else if (this.state.searchText === "" && this.state.tags !== "") {
            this.fetchData("search", "tags");
          }
        }
      );
    }
  };

  onSearchClick = (e) => {
    e.preventDefault();
    if (this.state.searchText !== "") {
      this.setState({ pageNumber: 1 }, () => this.fetchData("search", "text"));
    }
  };

  selectTag = (e) => {
    e.preventDefault();
    const { id } = e.target;
    this.setState({ tags: id === "clear" ? "" : id, pageNumber: 1 }, () => {
      if (this.state.tags !== "") {
        this.fetchData("filter", "tags");
      } else {
        this.fetchData();
      }
    });
  };

  onDownloadImage = (url, id) => {
    let extension = url.split(".");
    extension = extension[extension.length - 1];
    saveAs(url, `${id}.${extension}`);
  };

  render() {
    return (
      <div className="container">
        {/* Start - Search Container */}
        <div className="search-container">
          <input
            type="text"
            class="form-control"
            placeholder="Search"
            onChange={this.onSearchTextChange}
          />
          <button className="btn btn-primary" onClick={this.onSearchClick}>
            Search
          </button>
        </div>
        <div className="tags-container">
          {TAGS.map((item) => (
            <button
              className={
                this.state.tags === item
                  ? "tag-buttons active-tag-buttons"
                  : "tag-buttons"
              }
              id={item}
              onClick={this.selectTag}
            >
              {item}
            </button>
          ))}
          <button className="clear-button" id="clear" onClick={this.selectTag}>
            Clear tags
          </button>
        </div>
        {/* End - Search Container */}

        {/* Start - Photos Container */}
        <div className="image-container">
          {this.state.displayData.map((item) => (
            <div className="thumbnail" key={item.id}>
              <img alt="" src={item.url_s} style={{ justifySelf: "center" }} />
              <button
                className="btn btn-secondary"
                onClick={() => this.onDownloadImage(item.url_s, item.id)}
              >
                Download
              </button>
            </div>
          ))}
        </div>
        {/* End - Photos Container */}

        {/* Start - Pagination */}
        <div className="pagination-container">
          <div className="records-container">
            <span style={{ color: "white" }}>Records per page : </span>
            <select
              value={this.state.recordsPerPage}
              onChange={this.onRecordsChange}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={75}>75</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="page-container">
            <i
              className="bi bi-chevron-left"
              onClick={(e) => this.onPageChange(-1)}
            ></i>
            <span>{this.state.pageNumber}</span>
            <i
              class="bi bi-chevron-right"
              onClick={(e) => this.onPageChange(1)}
            ></i>
          </div>
        </div>
        {/* End - Pagination */}
      </div>
    );
  }
}

export default App;
