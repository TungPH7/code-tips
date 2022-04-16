import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Menu from "../../../@setproduct-ui/core/Menu";
import { setFilter } from "../../../reduxToolkit/mcc/filter/FilterSlice";
import SimpleBar from "simplebar-react";
import("simplebar/dist/simplebar.css");
import MenuDivider from "../../../@setproduct-ui/core/Menu/MenuDivider";
import Button from "../../../@setproduct-ui/core/Button";
import { useSelector } from "react-redux";
import Spinner from "../../../@setproduct-ui/core/Spinner"
import "./FilterMenuCs.scss"
// import { is } from "@reduxjs/toolkit/node_modules/immer/dist/internal";

let initAcTypeList = [
    {
        acType: 'a320',
        children: [
            'GH-1111 (1)',
            'GH-2222 (2)'
        ]
    },
    {
        acType: 'a420',
        children: [
            'GH-3333 (3)',
            'GH-4444 (4)',
            'GH-5555 (5)',
            'GH-123 (2)',
            'GH-321 (5)',
        ]
    },
    {
        acType: 'a520',
        children: [
            'GH-6 (6)',
            'GH-7 (7)',
            'GH-8 (8)'
        ]
    },
    {
        acType: 'a620',
        children: [
            'GH-9 (9)',
            'GH-A (a)',
            'GH-B (b)',
            'GH-C (c)'
        ]
    }
]

const FilterAcTypeMenuCs = (props) => {
    const [aircraftTypeList, setAircraftTypeList] = useState([])
    const [checkedAcType, setCheckedAcType] = useState([])
    const [checkedAcTail, setCheckedAcTail] = useState([])

    useEffect(() => {
        setAircraftTypeList(initAcTypeList)
    }, [])

    console.log('checkedAcType', checkedAcType)
    console.log('checkedAcTail', checkedAcTail)

    const handleCheckedAcType = (acTypeItem) => {
        const isChecked = checkedAcType.includes(acTypeItem.acType)
        // check or unCheck 1 acType
        setCheckedAcType(prevState => {
            if (isChecked) {
                return prevState.filter(item => item !== acTypeItem.acType)
            } else {
                return [...prevState, acTypeItem.acType]
            }
        })

        setCheckedAcTail(prevState => {
            if (isChecked) {
                // unCheck all acTails in 1 acType
                return prevState.filter(item => !acTypeItem.children.includes(item))
            } else {
                // check all acTails in 1 acType
                let acTailArrTemp = acTypeItem.children.filter(item => {
                    return !prevState.includes(item)
                })
                return [...prevState, ...acTailArrTemp]
            }
        })
    }

    const handleCheckedAcTail = (acTail, acTailArr, acTypeItem) => {
        const isChecked = checkedAcTail.includes(acTail)

        // check or unCheck 1 acTail
        setCheckedAcTail(prevState => {
            if (isChecked) {
                return prevState.filter(item => item !== acTail)
            } else {
                return [...prevState, acTail]
            }
        })

        setCheckedAcType(prevState => {
            if (isChecked) {
                // unCheck acType if there is at least one unchecked acTail
                return prevState.filter(item => item !== acTypeItem.acType)
            } else {
                // check acType if all acTails are checked
                let checkedAcTailsInOneAcType = checkedAcTail.filter(item => acTailArr.includes(item))
                let isAllTailsChecked = [...checkedAcTailsInOneAcType, acTail].length === acTailArr.length
                return isAllTailsChecked ? [...prevState, acTypeItem.acType] : prevState
            }
        })
    }

    const showAircraftTypeList = () => {
        return aircraftTypeList.map((acTypeItem, i) => {
            return (
                <div className="aircraft-type__list-wrapper">
                    <div className="aircraft-type__group" key={i}>
                        <div className="aircraft-type d-flex align-items-center">
                            <input
                                type="checkbox"
                                className="aircraft-type-input"
                                checked={checkedAcType.includes(acTypeItem.acType)}
                                onChange={() => handleCheckedAcType(acTypeItem)}
                                id={i}
                            />
                            <label htmlFor={i} className="aircraft-type-label">{acTypeItem.acType}</label>
                        </div>
                        {acTypeItem.children.map((acTail, j) => {
                            return (
                                <div className="aircraft-tail d-flex align-items-center" key={`${i}${j}tail`}>
                                    <input
                                        type="checkbox"
                                        className="aircraft-tail-input"
                                        checked={checkedAcTail.includes(acTail)}
                                        onChange={() => handleCheckedAcTail(acTail, acTypeItem.children, acTypeItem)}
                                        id={`${i}${j}tail`}
                                    />
                                    <label htmlFor={`${i}${j}tail`} className="aircraft-tail-label">{acTail}</label>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        })
    }

    const handleSelectAll = () => {
        let acTypeListTemp = []
        let acTailListTemp = []

        aircraftTypeList.forEach((acTypeItem, i) => {
            acTypeListTemp.push(acTypeItem.acType)
            acTypeItem.children.forEach((acTail, i) => {
                acTailListTemp.push(acTail)
            })
        })

        setCheckedAcType(acTypeListTemp)
        setCheckedAcTail(acTailListTemp)
    }

    const handleDeselectAll = () => {
        setCheckedAcType([])
        setCheckedAcTail([])
    }

    const dispatchForm = () => {
        if (lastStatus != airCraftType) {
            document.getElementById("aircraftTypeFilter").textContent = airCraftType == null ? "" : ": " + airCraftType
            dispatch(
                setFilter({
                    aircraft_type: airCraftType,
                })
            )
        }
        document.getElementById("aircraftTypeFilter").click()
    }

    const unSetOption = () => {
        if (lastStatus !== null) {
            setAirCraftType(null)
            document.getElementById("aircraftTypeFilter").textContent = "";
            dispatch(
                setFilter({
                    aircraft_type: null,
                })
            )
        }
        document.getElementById("aircraftTypeFilter").click()
    }

    if (aircraftTypeList.length > 0) {
        return (
            <Menu
                view="raised"
                color="default"
                type="dense"
                className="ss-setpro-filterdrop"
            >
                <SimpleBar className="dropdownfilter aircraft-filter-menu">
                    {showAircraftTypeList()}
                </SimpleBar>
                <div className="select-control">
                    <span onClick={handleSelectAll} className="select-control__select-all">Select All</span>
                    <span onClick={handleDeselectAll} className="select-control__deselect-all">Deselect All</span>
                </div>
                <div className="d-flex align-items-center justify-content-center justify-content-md-between brdtop mt-2">
                    <Button
                        className="planbutton m-2"
                        text="Reset"
                        onClick={() => {
                            unSetOption();
                        }}
                    />
                    <Button
                        className="btnflagapply actionbutton m-2"
                        text="Apply"
                        onClick={() => {
                            dispatchForm();
                        }}
                    />
                </div>
            </Menu>
        );
    } else {
        return (
            <Menu
                view="raised"
                color="default"
                type="dense"
                className="ss-setpro-filterdrop"
            >
                <div className="d-flex align-items-center justify-content-center">
                    <div className="py-2 no-data">No data</div>
                </div>
            </Menu>
        );
    }
};

export default FilterAcTypeMenuCs;
