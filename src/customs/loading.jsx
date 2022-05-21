import "../css/component/loading.scss"

const Loading = ({ loading = false, children }) => {
    return (
        <>
            {
                loading ? (
                    <>
                        <div className='tetrominos'>
                            <div className='tetromino box1'></div>
                            <div className='tetromino box2'></div>
                            <div className='tetromino box3'></div>
                            <div className='tetromino box4'></div>
                        </div>
                    </>
                ) : children
            }
        </>
    )
}

export default Loading;
