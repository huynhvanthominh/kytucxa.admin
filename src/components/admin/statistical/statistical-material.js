import { useEffect, useState } from "react";
import { materialTypeService } from "../../../apis/material-type.api";
import { materialService } from "../../../apis/material.api";
import { TOAST } from "../../../customs/toast-custom";

const StatisticalMaterial = () => {
    const [materialTypes, setMaterialTypes] = useState([]);
    const [selected, setSelected] = useState("");
    const [materials, setMaterials] = useState([]);

    const getColumn = id => {
        switch (+id) {
            case 1:
                return "moi";
            case 2:
                return "thanhly";
            case 3:
                return "dangsudung";
            case 4:
                return "chothue";
            case 5:
                return "daban";
            case 6:
                return "hong";
        }
    }

    const total = (item) => {
        return +item.moi + +item.thanhly + +item.dangsudung + +item.chothue + +item.daban + +item.hong
    }

    const fetchMaterials = async () => {
        try {
            if (selected !== "") {
                const { data } = await materialService.statisticalByMaterialType(selected);
                let tmp = [];
                data.forEach(item => {
                    const index = tmp.findIndex(obj => obj.id === item.id)
                    if (index >= 0) {
                        tmp[index] = {
                            ...tmp[index],
                            [getColumn(item.idStatus)]: item.total
                        }
                    } else {
                        tmp.push({
                            id: item.id,
                            name: item.name,
                            moi: +item.idStatus === 1 ? item.total : 0,
                            thanhly: +item.idStatus === 2 ? item.total : 0,
                            dangsudung: +item.idStatus === 3 ? item.total : 0,
                            chothue: +item.idStatus === 4 ? item.total : 0,
                            daban: +item.idStatus === 5 ? item.total : 0,
                            hong: +item.idStatus === 6 ? item.total : 0
                        })
                    }
                })
                setMaterials(tmp)
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    useEffect(() => {
        fetchMaterials();
    }, [selected])

    const fetchMaterialTypes = async () => {
        try {
            const { data } = await materialTypeService.get();
            setMaterialTypes(data)
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    useEffect(() => {
        fetchMaterialTypes();
    }, [])

    return (
        <div>
            <div className="d-flex align-items-center">
                <div>
                    <h3>Thống kê: Loại vật chất</h3>
                </div>
            </div>
            <div className="border-bottom border-primary border-5" />
            <div className="py-4">
                <div className="row">
                    <div className="col-lg-2">
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="d-flex justify-content-center">
                                            Tên loại vật chất
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    materialTypes.map((materialType, i) => (
                                        <tr key={i} className={materialType.id === selected ? "table-primary" : ""} onClick={() => setSelected(materialType.id)}>
                                            <td>{materialType.name}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="col-lg-10">
                        <table className="table table-hover table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="d-flex justify-content-center">
                                            Tên vật chất
                                        </div>
                                    </th>
                                    <th>
                                        <div className="d-flex justify-content-center">
                                            Tổng
                                        </div>
                                    </th>
                                    <th>
                                        <div className="d-flex justify-content-center">
                                            Mới
                                        </div>
                                    </th>
                                    <th>
                                        <div className="d-flex justify-content-center">
                                            Thanh lý
                                        </div>
                                    </th>
                                    <th>
                                        <div className="d-flex justify-content-center">
                                            Đang sử dụng
                                        </div>
                                    </th>
                                    <th>
                                        <div className="d-flex justify-content-center">
                                            Cho thuê
                                        </div>
                                    </th>
                                    <th>
                                        <div className="d-flex justify-content-center">
                                            Đã bán
                                        </div>
                                    </th>
                                    <th>
                                        <div className="d-flex justify-content-center">
                                            Hỏng
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    materials.map((material, i) => (
                                        <tr key={i}>
                                            <td>{material.name}</td>
                                            <td className="center">{total(material)}</td>
                                            <td className="center">{material.moi}</td>
                                            <td className="center">{material.thanhly}</td>
                                            <td className="center">{material.dangsudung}</td>
                                            <td className="center">{material.chothue}</td>
                                            <td className="center">{material.daban}</td>
                                            <td className="center">{material.hong}</td>
                                        </tr>
                                    ))
                                }
                                {
                                    materials.length === 0 && (
                                        <tr>
                                            <td colSpan={8}  className="center">
                                                Không có số lượng vật chất để thống kê
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatisticalMaterial;