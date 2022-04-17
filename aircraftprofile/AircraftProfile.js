import React from "react"
import FlylogoCs from "../../../navigation/FlylogoCs"
import { Button } from "../../../component/shared/button/Button"
import "./AircraftProfile.scss"

const AircraftProfile = () => {
    const users = [
        {
            head1: 'Flydocs',
            subUsers: [
                {
                    name: 'brian1',
                    note: 'note1'
                },
                {
                    name: 'brian2',
                    note: 'note2'
                },
                {
                    name: 'brian3',
                    note: 'note3'
                },
            ]
        },
        {
            head1: 'Flydocs India',
            subUsers: [
                {
                    name: 'Nick 1',
                    note: 'Nick note1'
                },
                {
                    name: 'Nick 2',
                    note: 'Nick note2'
                },
                {
                    name: 'Nick 3',
                    note: 'Nick note3'
                },
            ]
        }
    ]

    let listUser = users.map((user, i) => {
        return (
            <>
                <tr>
                    <td>{user.head1}</td>
                </tr>
                {user.subUsers.map((subUser, i) => {
                    return (
                        <tr key={i}>
                            <td>{subUser.name}</td>
                            <td>{subUser.note}</td>
                        </tr>
                    )
                })}
            </>
        )
    })

    return (
        <div className="current-status">
            <header className="navbar-fixed-top current-status__header" id="navbar-header">
                <div className="d-flex justify-content-between align-items-center current-status__container">
                    <div>
                        <FlylogoCs />
                    </div>
                    <ul className="current-status__nav-bar">
                        <li className="current-status__nav-bar-item current-status__nav-bar-item--active"><a href="#">Aircraft profile</a></li>
                        <li className="current-status__nav-bar-item"><a href="#">Return project management</a></li>
                        <li className="current-status__nav-bar-item"><a href="#">Delivery binder</a></li>
                        <li className="current-status__nav-bar-item"><a href="#">ADs</a></li>
                        <li className="current-status__nav-bar-item"><a href="#">Modifications</a></li>
                        <li className="current-status__nav-bar-item"><a href="#">Assemblies</a></li>
                        <li className="current-status__nav-bar-item"><a href="#">Components</a></li>
                        <li className="current-status__nav-bar-item"><a href="#">Structures</a></li>
                    </ul>
                </div>
            </header>
            <div className="aircraft-profile">
                <div className="aircraft-profile__header">
                    <div className="d-flex justify-content-between align-items-center aircraft-profile__header-wrapper">
                        <h1 className="aircraft-profile__heading">Aircraft Profile</h1>
                        <ul className="d-flex aircraft-profile__menu">
                            <a className="ml-10">
                                <Button className="aircraft-profile__menu-item" isBorder={false} name='Audit trail'/>
                            </a>
                            <a className="ml-10">
                                <Button className="aircraft-profile__menu-item" isBorder={false} name='Add checklist'/>
                            </a>
                            <a className="ml-10">
                                <Button className="aircraft-profile__menu-item" isBorder={false} name='Close'/>
                            </a>
                        </ul>
                    </div>
                </div>
                <div className="aircraft-profile__detail">
                    <div className="d-flex justify-content-start aircraft-profile__detail-wrapper">
                        <table className="aircraft-profile__detail-list">
                            <tr>
                                <td>Aircraft Tail</td>
                                <td>00234</td>
                            </tr>
                            <tr>
                                <td>Lessor</td>
                                <td>Name</td>
                            </tr>
                            <tr>
                                <td>Date of Manufacture</td>
                                <td>02-03-2019</td>
                            </tr>
                        </table>
                        <table className="aircraft-profile__detail-list">
                            <tr>
                                <td>Aircraft Tail</td>
                                <td>00234</td>
                            </tr>
                            <tr>
                                <td>Lessor</td>
                                <td>Name</td>
                            </tr>
                            <tr>
                                <td>Date of Manufacture</td>
                                <td>02-03-2019</td>
                            </tr>
                        </table>
                        <table className="aircraft-profile__detail-list">
                            <tr>
                                <td>Aircraft Tail</td>
                                <td>00234</td>
                            </tr>
                            <tr>
                                <td>Lessor</td>
                                <td>Name</td>
                            </tr>
                            <tr>
                                <td>Date of Manufacture</td>
                                <td>02-03-2019</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="aircraft-profile__project-teams">
                    <div className="aircraft-profile__project-teams-wrapper">
                        <h3 className="aircraft-profile__project-teams-heading">Project Teams</h3>
                        <div className="d-flex justify-content-between aircraft-profile__table">
                            <div className="aircraft-profile__table-group">
                                <div className="aircraft-profile__table-flydocs-user">
                                    {/* <table class="">
                                        <thead>
                                            <tr>
                                                <th>flydocs Users</th>
                                                <th>Additional Information</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Kamlesh Kharva</td>
                                                <td>Technical Records- Components</td>
                                            </tr>
                                            <tr>
                                                <td>Priyank Patel</td>
                                                <td>MRO/Maintenance</td>
                                            </tr>
                                        </tbody>
                                    </table> */}
                                    <table>
                                        <tr>
                                            <th>flydocs Users</th>
                                            <th>Additional Information</th>
                                        </tr>
                                        <tr>
                                            <td>Kamlesh Kharva</td>
                                            <td>Technical Records- Components</td>
                                        </tr>
                                        <tr>
                                            <td>Priyank Patel</td>
                                            <td>MRO/Maintenance</td>
                                        </tr>
                                        <tr>
                                            <td>Kamlesh Kharva</td>
                                            <td>Technical Records- Components</td>
                                        </tr>
                                        <tr>
                                            <td>Priyank Patel</td>
                                            <td>MRO/Maintenance</td>
                                        </tr>
                                        <tr>
                                            <td>Kamlesh Kharva</td>
                                            <td>Technical Records- Components</td>
                                        </tr>
                                        <tr>
                                            <td>Priyank Patel</td>
                                            <td>MRO/Maintenance</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <div className="aircraft-profile__table-group">
                                <div className="aircraft-profile__table-main-client">
                                    <table>
                                        <tr>
                                            <th>Main Client Users</th>
                                            <th>Additional Information</th>
                                        </tr>
                                        <tr>
                                            <td className="fw-b indent-left-20">Technical Records</td>
                                            <td className="indent-left-20"></td>
                                        </tr>
                                        <tr>
                                            <td className="fw-b indent-left-28">Engineer</td>
                                            <td className="indent-left-28"></td>
                                        </tr>
                                        <tr className="row-bg">
                                            <td className="indent-left-36">kamlesh main kharva</td>
                                            <td>Notes</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-b indent-left-20">Technical Records</td>
                                            <td className="indent-left-20"></td>
                                        </tr>
                                        <tr>
                                            <td className="fw-b indent-left-28">Engineer</td>
                                            <td className="indent-left-28"></td>
                                        </tr>
                                        <tr className="row-bg">
                                            <td className="indent-left-36">kamlesh main kharva</td>
                                            <td>Notes</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <div className="aircraft-profile__table-group">
                                <div className="aircraft-profile__table-third-party">
                                    <table>
                                        <tr>
                                            <th>Third Party Users</th>
                                            <th>Additional Information</th>
                                        </tr>
                                        <tr>
                                            <td className="fw-b indent-left-20">FLYdocs</td>
                                            <td className="indent-left-20"></td>
                                        </tr>
                                        <tr className="row-bg">
                                            <td className="indent-left-28">Krunal Patel1</td>
                                            <td>MRO/Maintenance</td>
                                        </tr>
                                        <tr className="row-bg">
                                            <td className="indent-left-28">Krunal Patel1</td>
                                            <td>MRO/Maintenance</td>
                                        </tr>
                                        <tr className="row-bg">
                                            <td className="indent-left-28">Krunal Patel1</td>
                                            <td>MRO/Maintenance</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>abc</div>
            </div>
        </div>
    )
}

export default AircraftProfile