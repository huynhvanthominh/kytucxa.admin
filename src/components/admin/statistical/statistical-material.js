import { useEffect, useState } from "react";
import { materialTypeService } from "../../../apis/material-type.api";
import { materialService } from "../../../apis/material.api";
import { TOAST } from "../../../customs/toast-custom";

const StatisticalMaterial = () => {
    const [materialTypes, setMaterialTypes] = useState([]);
    const [selected, setSelected] = useState("");
    const [materials, setMaterials] = useState([]);

    const fetchMaterials = async () => {
        try {
            if (selected !== "") {
                const { data } = await materialService.getByIdLoaivatchat(selected);
                let tmp = [];
                data.forEach(item => {
                    materialService.getDetailMaterial(item.id).then(rs => {
                        tmp = [...tmp, rs.data]
                    })
                    console.log(tmp);
                });
                console.log(tmp);
                setMaterials(data)
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
                                            <td className="center">{materials.length}</td>
                                            <td className="center">{materials.filter(item => item.idStatus === 1).length}</td>
                                        </tr>
                                    ))
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