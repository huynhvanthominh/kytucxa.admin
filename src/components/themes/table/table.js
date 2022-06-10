/* eslint-disable react-hooks/exhaustive-deps */
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import MobiledataOffIcon from '@mui/icons-material/MobiledataOff';
import { Pagination } from '@mui/material';
import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';

const Table = ({ dataSource, children, ...props }) => {

  const limits = children?.limit ? children.limit : [5, 10, 20, -1]
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(limits[0]);
  const [count, setCount] = useState(10);
  const columns = children.columns;
  const [loading, setLoading] = useState(true);
  const [columnsSort, setColumnsSort] = useState(() => {
    const tamp = [];
    columns.forEach((item) => {
      tamp.push({ direction: "none", key: item.data, sort: item.sort });
    });
    return tamp;
  });

  const handleCount = () => {
    if (data.length % limit === 0) {
      setCount(parseInt(data.length / limit))
    } else {
      setCount(parseInt(data.length / limit) + 1)
    }
  }

  useEffect(() => handleCount(), [data, limit])

  useEffect(() => setPage(1), [data])

  useEffect(() => {
    setLoading(true);
    setData(dataSource);
    setTimeout(() => setLoading(false), 1000)
  }, [dataSource])

  const renderData = (data) => {
    return columns.map((item, index) => {
      if (item.render === undefined) {
        return <td key={index}>{data[item.data]}</td>;
      } else {
        return <td key={index}>{item.render(data[item.data], data)}</td>;
      }
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setPage(1)
    setSearch(value);
    if (search.length === 0) {
      setData(dataSource);
    } else {
      setData(
        dataSource.filter((item) => {
          var show = false;
          for (let i = 0; i < columns.length; i++) {
            if (columns[i].search !== false) {
              let key = columns[i].data;
              let string = item[key].toString().toUpperCase();
              let stringChilren = search.toString().toUpperCase();
              if (string.includes(stringChilren)) {
                show = true;
              }
            }
          }
          return show;
        })
      );
    }
  };

  const Select = () => {
    return (
      <>
        <select className='form-select' value={limit} onChange={(e) => {
          setLoading(true)
          setLimit(e.target.value > 0 ? e.target.value : data.length)
          setPage(1)
          setTimeout(() => setLoading(false), 500)
        }}>
          {
            limits.map((option, index) => <option key={index} value={option}>{option > 0 ? option : "all"}</option>)
          }
        </select>
      </>
    )
  }

  const handleSort = (index) => {
    const direction = columnsSort[index].direction;
    const key = columnsSort[index].key;
    const sort = columnsSort[index].sort;
    var tamp = columnsSort;
    tamp[index].direction = direction === "ASC" ? "DSC" : "ASC";
    setColumnsSort(tamp);
    if (sort === true) {
      const dataSort = [...data];
      dataSort.sort((a, b) => {
        if (typeof a[key] === "string" || typeof b[key] === "string") {
          return direction === "ASC"
            ? a[key].localeCompare(b[key])
            : b[key].localeCompare(a[key]);
        }
        return direction === "ASC" ? a[key] - b[key] : b[key] - a[key];
      });
      setData(dataSort);
    }
  };

  const renderHeader = () => {
    return columns.map((item, index) => {
      return (
        <th key={index} onClick={() => handleSort(index)}>
          <div
            className={"d-flex align-items-center " + item.className}
          >
            {item.title}
            {
              columnsSort[index].sort && (
                columnsSort[index].direction === "none" ? <MobiledataOffIcon /> : (
                  columnsSort[index].direction === "ASC" ? (<ArrowDropUpIcon />) : (<ArrowDropDownIcon />)
                )
              )
            }
          </div>
        </th>
      );
    })
  }

  return (
    <div className='theme_table'>
      <div className='theme_table_container'>
        <div className="d-flex">
          <div>
            <Select />
          </div>
          <div className="ms-auto pb-2 d-flex">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={(e) => handleSearch(e)}
              placeholder="Search..."
              className="form-control"
            ></input>
            {props.filter && <div className='ms-2'>
              {props.filter}
            </div>}
          </div>
        </div>
        <table className={"table" + (props.striped ? " table-striped" : "") + (props.hover ? " table-hover" : "") + (props.border ? " table-bordered" : "")}>
          <thead>
            <tr>
              {renderHeader()}
            </tr>
          </thead>
          <tbody>
            {
              loading ?
                <tr>
                  <td colSpan={columns.length}>
                    <div className='d-flex justify-content-center'>
                      <CircularProgress />
                    </div>
                  </td>
                </tr> :
                data.length > 0 ?
                  data.slice((page - 1) * limit, page * limit).map((item, index) => (
                    <tr key={index}>{renderData(item)}</tr>
                  )) :
                  <tr>
                    <td colSpan={columns.length}>
                      <div className='d-flex justify-content-center'>
                        <h5>Data empty</h5>
                      </div>
                    </td>
                  </tr>
            }
          </tbody>
        </table>
        <div className='d-flex justify-content-end align-items-center'>
          {limit > 0 && data.length > 0 && count > 1 && (
            <>
              Total: {data.length}
              <Pagination count={count} page={page} onChange={(e, val) => {
                setLoading(true)
                setPage(val)
                setTimeout(() => setLoading(false), 500)
              }} color="primary" showFirstButton={count >= 10} showLastButton={count >= 10} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Table;
