import moment from "moment"

const TableDateCustom = ({ date = "" }) => {
    return (
        <div className="table-date">
            <p className="table-date-day">{moment(date).format("DD/MM/YYYY")}</p>
            <p className="table-date-time">{moment(date).format("HH:mm:ss")}</p>
        </div>
    )
}

export default TableDateCustom;