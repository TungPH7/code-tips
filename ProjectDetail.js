import React, { useEffect, useRef, useState } from 'react'
import { Dropdown } from "react-bootstrap"
import { Link, useParams } from 'react-router-dom'
import { BackButton } from '../../components/shared/back-button/BackButton'
import { Print } from '../../components/shared/print/Print'
import { getProjectDetailApi, getProjectAdminDetailApi, getProjects, getProjectsAdmin } from '../../services/ProjectDetailService'
import { PieChart } from '../../components/chart/PieChart'
import { BarChart } from '../../components/chart/BarChart'
import { BAR_OPTIONS_DEFAULT, PIE_COLORS, PIE_OPTIONS_DEFAULT } from '../../constants/Constants'
import { Button } from '../../components/shared/button/Button'
import { SearchInput } from '../../components/shared/search-input/SearchInput'
import { ProjectDetailUserList } from '../../components/project-detail/ProjectDetailUserList'
import { LastActivity } from '../../components/shared/last-activity/LastActivity'
import { baseUrl } from '../../services/ApiConfig'
import { useNavigate } from 'react-router-dom'
import { getCustodianApi } from '../../services/CustodianService'
import { ProjectDetailMembers } from '../../components/project-detail/ProjectDetailMembers'
import { ProjectDetailQuickStats } from '../../components/project-detail/ProjectDetailQuickStats'
import { Loading } from '../../components/shared/loading/Loading';
import { RequestArchive } from '../../components/shared/popup/RequestArchive'
import { ConfirmArchive } from '../../components/shared/popup/ConfirmArchive'
import '../../components/project-detail/styles.scss'
import { numFormatter } from '../../helpers/FormatterHelper'

const ProjectDetail = () => {
    const { projectId } = useParams()
    const [projectData, setProjectData] = useState({})
    const [lastAtivities, setLastAtivities] = useState([])
    const [projectList, setProjectList] = useState([])
    const [projectItemId, setProjectItemId] = useState(projectId)
    const [custodianData, setCustodianData] = useState([])
    const [userInfo, setUserInfo] = useState({})
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(false);
    const [memberLoading, setMemberLoading] = useState(false);
    const navigate = useNavigate()
    const inputRef = useRef()
    const [showPopup, setShowPopup] = useState(false)
    const [hasArchiveRequest, setHasArchiveRequest] = useState(false)

    let project = {}
    if (Object.keys(projectData).length > 0) {
        project = projectData.project
    }

    // Initial suggestions auto complete
    let custodianName = custodianData.map(({ custodian_name }) => custodian_name)
    let custodianEquipment = custodianData.map(({ equipment }) => equipment)
    let suggestionsAutoComplete = [...custodianName, ...custodianEquipment]

    useEffect(() => {
        if (localStorage.getItem('user-infor') && JSON.parse(localStorage.getItem('user-infor'))) {
            let userInfoLocal = JSON.parse(localStorage.getItem('user-infor'))
            setUserInfo(userInfoLocal)
            if (userInfoLocal.roles.includes("Client Admin") || userInfoLocal.roles.includes("Admin")) {
                setIsAdmin(true)
            }
        }
    }, [])

    useEffect(() => {
        fetchProjects()
    }, [isAdmin])

    useEffect(async () => {
        fetchProjectData()
        fetchCustodian()
    }, [projectItemId, isAdmin])

    const fetchCustodian = async () => {
        try {
            const dataResult = await getCustodianApi(projectItemId, null, null, null);
            setCustodianData(dataResult.data.items);
        } catch (err) {
            console.log(err)
        }
    };

    const fetchProjectData = async () => {
        setLoading(true);
        if (isAdmin) {
            try {
                const dataResult = await getProjectAdminDetailApi(projectItemId, null, null, null)
                setProjectData(dataResult.data)
                setLoading(false);
                if (dataResult.data.project.archiveStatus === "Pending" && userInfo.roles.includes("Admin")) {
                    // setShowPopup(true)
                    setHasArchiveRequest(true)
                }
            } catch (err) {
                navigate('/projects')
                console.log(err)
                setLoading(false);
            }
        } else {
            try {
                const dataResult = await getProjectDetailApi(projectItemId, null, null, null)
                setProjectData(dataResult.data.project);
                // setProjectList(dataResult.data.listProjects);
                setLoading(false);
            } catch (err) {
                console.log(err)
            }
        }
    }

    const fetchProjects = async () => {
        if (isAdmin) {
            try {
                const dataResult = await getProjectsAdmin()
                setLastAtivities(dataResult.data.recentActivities)
                setProjectList(dataResult.data.paginationProjects.items)
            } catch (err) {
                console.log(err)
            }
        } else {
            try {
                const dataResult = await getProjects()
                setLastAtivities(dataResult.data.recentActivities)
                setProjectList(dataResult.data.paginationProjects.items)
            } catch (err) {
                console.log(err)
            }
        }
    }

    const pieChartData = () => {
        let label = "";
        let data = [];
        let projDes = {};
        const sumResponsive = project.nonResponsive + project.responsive
        const nonResponsivePercent = ((project.nonResponsive / sumResponsive) * 100).toFixed(1)
        const responsivePercent = ((project.responsive / sumResponsive) * 100).toFixed(1)

        label = [
            `Non-Responsive (${nonResponsivePercent}%)`,
            `Responsive (${responsivePercent}%)`
        ]

        data = [project.nonResponsive, project.responsive]

        projDes = {
            responsive: {
                title: "Responsive Items",
                value: `(${project.responsive.toLocaleString("en-US")} items)`,
            },
            non_responsive: {
                title: "Non-Responsive Items",
                value: `(${project.nonResponsive.toLocaleString("en-US")} items)`,
            }
        };

        return {
            labels: label,
            datasets: [
                {
                    data: data,
                    backgroundColor: PIE_COLORS,
                    borderWidth: 1,
                    hoverOffset: 2,
                    datalabels: {
                        anchor: "end",
                        align: "end",
                    },
                    data_description: projDes,
                },
            ],
        };
    };

    const pieChartOptions = () => {
        return {
            plugins: {
                ...PIE_OPTIONS_DEFAULT.plugins,
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        label: (context) => {
                            return `${context.label}: ${context.formattedValue} Items`
                        },
                    },
                },
            }
        }
    }

    const barChartData = (type) => {
        if (type === 'activityMTD') {
            const data = [
                project.activityMtd?.dataSource,
                project.activityMtd?.imported,
                project.activityMtd?.tagsResponsive,
                project.activityMtd?.exported,
            ];
            return {
                labels: [
                    "Data Sources Added",
                    "Imported (GB & # items)",
                    "Item Tagged Responsive",
                    "Item Exported",
                ],
                datasets: [
                    {
                        label: "",
                        data: data,
                        backgroundColor: PIE_COLORS,
                        borderWidth: 1,
                        datalabels: {
                            anchor: "end",
                            align: "end",
                            formatter: function (value, context) {
                                const index = context.dataIndex
                                let total = 0
                                if (index % 2 === 0) {
                                    total = context.dataset.data[index] + context.dataset.data[index + 1]
                                } else {
                                    total = context.dataset.data[index] + context.dataset.data[index - 1]
                                }

                                let itemPercent = (context.dataset.data[index] / total * 100).toFixed(1)

                                if (index === 1) {
                                    return `23.152GB - ${numFormatter(value)} (${itemPercent}%)`
                                }

                                return `${numFormatter(value)} Items (${itemPercent}%)`
                            }
                        },
                    },
                ],
            };
        }

        if (type === 'dataType') {
            const data = [
                project.videos,
                project.images,
                project.chatIM,
                project.email,
            ];
            return {
                labels: [
                    "Videos",
                    "Images",
                    "Chat/IM",
                    "eMail",
                ],
                datasets: [
                    {
                        label: "",
                        data: data,
                        backgroundColor: PIE_COLORS,
                        borderWidth: 1,
                        datalabels: {
                            anchor: "end",
                            align: "end",
                            formatter: function (value, context) {
                                const index = context.dataIndex
                                let total = 0
                                if (index % 2 === 0) {
                                    total = context.dataset.data[index] + context.dataset.data[index + 1]
                                } else {
                                    total = context.dataset.data[index] + context.dataset.data[index - 1]
                                }

                                let itemPercent = (context.dataset.data[index] / total * 100).toFixed(1)

                                return `${numFormatter(value)} Items (${itemPercent}%)`
                            }
                        },
                    },
                ],
            };
        }
    };

    const barChartOptions = (type) => {
        if (type === 'activityMTD') {
            return {
                plugins: {
                    ...BAR_OPTIONS_DEFAULT.plugins,
                    tooltip: {
                        displayColors: false,
                        callbacks: {
                            label: (context) => {
                                const index = context.dataIndex
                                if (index === 1) {
                                    return `23.152GB - ${context.formattedValue}`
                                }

                                return `${context.formattedValue} Items`
                            }
                        }
                    }
                }
            }
        }

        if (type === 'dataType') {
            return {
                plugins: {
                    ...BAR_OPTIONS_DEFAULT.plugins,
                    tooltip: {
                        displayColors: false,
                        callbacks: {
                            label: (context) => {
                                return `${context.formattedValue} Items`
                            }
                        }
                    }
                }
            }
        }

        return {}
    }

    const showDropDownMenu = () => {
        return projectList.map((project) => {
            console.log(project)

            return (
                <Dropdown.Item key={project.id} onClick={() => { handleClickDropItem(project.id) }}>
                    {project.name}
                </Dropdown.Item>
            )
        })
    }

    const goBack = () => {
        navigate(-1);
    }

    const handleClickDropItem = (projectId) => {
        setProjectItemId(projectId)
    }

    // Handle search for custodian
    const onGetSearchCustodian = async () => {
        try {
            const dataResult = await getCustodianApi(projectItemId, 6, 1, inputRef.current != undefined ? inputRef.current.value : null)
            setCustodianData(dataResult.data.items)
        } catch (err) {
            console.log(err)
        }
    }

    const handleClickArchive = () => {
        if (userInfo.roles.includes("Client Admin")) {
            open()
        } else if (userInfo.roles.includes("Admin") && hasArchiveRequest) {
            open()
        } else {
            close()
        }
    }

    const showAdminBtn = () => {
        if (userInfo && Object.keys(userInfo).length > 0) {
            if (isAdmin) {
                return (
                    <>
                        <Button handleClick={handleClickArchive} className='project-detail__btn-archive' iconUrl='/images/archive-icon.svg' name='Archive' altIcon='Archive' />
                        <Button className='project-detail__btn-archive' iconUrl='/images/man-user-icon.svg' name='Add Users' altIcon='AddUsers' />
                    </>
                )
            } else {
                return ''
            }
        } else {
            return ''
        }
    }

    const close = () => setShowPopup(false);
    const open = () => setShowPopup(true);

    const onUsersUpdated = async () => {
        try {
            setMemberLoading(true);
            const dataResult = await getProjectDetailApi(projectItemId, null, null, null);
            setProjectData(dataResult.data);
            setMemberLoading(false);
        } catch (e) {
            setMemberLoading(false);
        }
    };

    const handleSetHasArchiveRequest = () => {
        setHasArchiveRequest(false)
    }

    return (
        <div id="container" className="container-fluid project-detail">
            {
                Object.keys(userInfo).length > 0 ?
                    (userInfo.roles.includes("Client Admin") ?
                        <RequestArchive
                            isShow={showPopup}
                            handleClose={close}
                            projectId={projectItemId}
                        /> :
                        '') :
                    ''
            }
            {
                Object.keys(userInfo).length > 0 ?
                    (userInfo.roles.includes("Admin") ?
                        <ConfirmArchive
                            isShow={showPopup}
                            handleClose={close}
                            projectId={projectItemId}
                            setHasArchive={handleSetHasArchiveRequest}
                        /> :
                        '') :
                    ''
            }
            <div className="main" id="main">
                <div className='project-detail__head'>
                    <BackButton goBack={goBack} />
                    <div className='project-detail__project-view d-flex align-items-center justify-content-between'>
                        <div className='d-flex align-items-center'>
                            <h2 className='project-detail__sub-heading'>Project View</h2>
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="outline-secondary"
                                    id="dropdown-basic"
                                    className="project-detail__dropdown"
                                >
                                    {project.name}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {showDropDownMenu()}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className='d-flex'>
                            {showAdminBtn()}
                            <Print className='ml-16' />
                        </div>
                    </div>
                    <div className='project-detail__info d-flex align-items-center'>
                        <span className='project-detail__title fw-b'>{project.name}</span>
                        <div className='project-detail__members'>
                            <ProjectDetailMembers
                                showLoading={memberLoading}
                                users={project.users || []} projectId={projectId}
                                onUsersUpdated={onUsersUpdated} />
                        </div>
                    </div>
                    <div className='project-detail__sub-title d-flex'>
                        <img src={baseUrl + '/' + project.projectImage} />
                        <h3>Apple Inc.</h3>
                    </div>
                </div>
                <div className='project-detail__body'>
                    <div className='project-detail__body-container d-flex'>
                        <div className='project-detail__body-section project-detail__quick-stats'>
                            <p className='project-detail__body-section-heading'>Quick Stats</p>
                            <ProjectDetailQuickStats project={project} />
                            {Object.keys(projectData).length > 0
                                ? <PieChart data={pieChartData()} options={pieChartOptions()} />
                                : ''
                            }
                        </div>
                        <div className='project-detail__body-section project-detail__mtd-data d-flex flex-column'>
                            <div className='mtd-data activity-mtd'>
                                <p className='project-detail__body-section-heading'>Activity MTD</p>
                                {Object.keys(projectData).length > 0
                                    ? <BarChart data={barChartData('activityMTD')} options={barChartOptions('activityMTD')} />
                                    : ''
                                }
                            </div>
                            <div className='mtd-data data-type'>
                                <p className='project-detail__body-section-heading'>Data Type </p>
                                {Object.keys(projectData).length > 0
                                    ? <BarChart data={barChartData('dataType')} options={barChartOptions('dataType')} />
                                    : ''
                                }
                            </div>
                        </div>
                    </div>

                    <div className='project-detail__body-container plr-12 row gx-5'>
                        <div className="project-detail__data-analysis col-12 col-lg-9 col-xl-10">
                            <div className='project-detail__data-analysis-head'>
                                <div className='d-flex align-items-center justify-content-between mb-24'>
                                    <h2 className='data-analysis-head__tile'>Data Analysis</h2>
                                    <div className='data-analysis-head__group-button d-flex'>
                                        <Link to='entities'>
                                            <Button className='data-analysis-head__btn' iconUrl='/images/custodian-blue-icon.svg' name='Entities' altIcon='Entities' />
                                        </Link>
                                        <Link to={''}>
                                            <Button className='data-analysis-head__btn' iconUrl='/images/search-icon.svg' name='Search' altIcon='Search' />
                                        </Link>
                                        <Link to={''}>
                                            <Button className='data-analysis-head__btn' iconUrl='/images/analyze-icon.svg' name='Analyze' altIcon='Analyze' />
                                        </Link>
                                        <Link to='communication-review'>
                                            <Button className='data-analysis-head__btn' iconUrl='/images/review-icon.svg' name='Review' altIcon='Review' />
                                        </Link>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center justify-content-between align-items-center mb-24'>
                                    <div className='data-analysis-head__count'>
                                        <span>{custodianData.length} Sources</span>
                                    </div>
                                    <form onSubmit={onGetSearchCustodian}>
                                        <SearchInput placeholder='Search Sources' inputRef={inputRef} isAutoComplete={true} suggestions={suggestionsAutoComplete} onSubmitSearch={onGetSearchCustodian} />
                                    </form>
                                </div>
                            </div>
                            <div className='project-detail__data-analysis-body row g-6'>
                                <ProjectDetailUserList custodianData={custodianData} />
                            </div>
                        </div>
                        <div className="project-detail__last-activity col-12 col-lg-3 col-xl-2">
                            <h3 className='project-detail-title'>Last Activity</h3>
                            {lastAtivities && lastAtivities.map((activity, activityIndex) => (
                                <LastActivity
                                    key={activityIndex}
                                    className="activities-box"
                                    logoUrl={`${baseUrl}/${activity.projectImage}`}
                                    title={activity.name}
                                    name={activity.projectName}
                                    content={activity.description}
                                    postTime={activity.time}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Loading loading={loading} />
        </div>
    )
}

export { ProjectDetail }
