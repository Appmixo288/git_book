import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PersistentDrawer from "../components/persistentDrawer";
import { getBrandApi, getCountApi } from "../API/api";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CardMedia from "@mui/material/CardMedia";

const Profile = () => {
  const [open, setOpen] = React.useState(false);
  const [img, setImg] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [arr, setarr] = useState([]);
  const [pageState, setPageState] = useState({
    isLoading: false,
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [tabVal, setTabVal] = useState(0);
  const [tabValIns, setTabValIns] = useState(0);
  const [mainTabVal, setMainTabVal] = useState(0);

  const [totalVal, setTotalVal] = useState({
    allBrand: 0,
    approvedBrand: 0,
    suspendBrand: 0,
    pendingBrand: 0,
    allInfluencer: 0,
    approvedInfluencer: 0,
    suspendInfluencer: 0,
    pendingInfluencer: 0,
  });

  useEffect(() => {
    countData();
    if (mainTabVal == 0) {
      tabVal == 0 && mainTabVal == 0
        ? getBrandAllData("brand", "approved")
        : tabVal == 1
        ? getBrandAllData("brand", "pending")
        : tabVal == 2
        ? getBrandAllData("brand", "suspended")
        : getBrandAllData("brand");
    } else if (mainTabVal == 1) {
      tabValIns == 0 && mainTabVal == 1
        ? getBrandAllData("influencer", "approved")
        : tabValIns == 1
        ? getBrandAllData("influencer", "pending")
        : tabValIns == 2
        ? getBrandAllData("influencer", "suspended")
        : getBrandAllData("influencer");
    }
  }, [pageState.page, pageState.pageSize]);

  const getBrandAllData = async (brand, status) => {
    console.log("getBrandAllData", pageState.pageSize, pageState.page);
    setPageState((old) => ({ ...old, isLoading: true }));
    const response = await getBrandApi(
      pageState.pageSize,
      pageState.page,
      brand,
      status
    );

    setarr(response.data.user);

    setPageState((old) => ({
      ...old,
      total: response.data.total_records,
      isLoading: false,
    }));
  };

  const countData = async () => {
    const res = await getCountApi();
    console.log("1232434", res.data);
    setTotalVal({
      allBrand: res.data.brandCount,
      approvedBrand: res.data.brandApprovedCount,
      suspendBrand: res.data.brandSuspendCount,
      pendingBrand: res.data.brandPendingCount,
      allInfluencer: res.data.infuencerCount,
      approvedInfluencer: res.data.infuencerApprovedCount,
      suspendInfluencer: res.data.infuencerSuspendCount,
      pendingInfluencer: res.data.infuencerPendingCount,
    });
  };

  const columns =
    arr[0]?.type_of_user == "brand"
      ? [
          // {
          //   field: "id",
          //   headerName: "id",
          //   width: "100px",
          //   minWidth: 80,
          //   flex: 1,
          // },

          {
            field: "image",
            headerName: "Image",
            minWidth: 70,
            width: 70,
            renderCell: (params) => (
              <Avatar
                alt="Kristagram"
                src="https://cdn.pixabay.com/photo/2018/02/09/21/46/rose-3142529__340.jpg"
                onClick={() => {
                  // console.log(')))',params.value)
                  setImg(
                    "https://cdn.pixabay.com/photo/2018/02/09/21/46/rose-3142529__340.jpg"
                  );
                  handleClickOpen();
                }}
              />
            ),
          },
          {
            field: "phone",
            headerName: "Phone",
            minWidth: 130,
            width: 130,
            flex: 1,
          },

          {
            field: "createdAt",
            headerName: "CreatedAt",
            width: 210,
            flex: 1,
            minWidth: 210,
          },
          // {
          //   field: "status",
          //   headerName: "status",
          //   width: "100px",
          //   minWidth: 80,
          //   flex: 1,
          // },
          // {
          //   field: "type_of_user",
          //   headerName: "type_of_user",
          //   width: "100px",
          //   minWidth: 80,
          //   flex: 1,
          // },
          {
            field: "updatedAt",
            headerName: "UpdatedAt",
            minWidth: 210,
            width: 210,
            flex: 1,
          },
          // { field: "brand_createdAt", headerName: "brand createdAt", width: 90 },

          {
            field: "brand_type_of_brand",
            headerName: "Type of brand",
            minWidth: 150,
            width: 150,
            flex: 1,
          },
          {
            field: "brand_user_id",
            headerName: "User id",
            minWidth: 200,
            width: 200,
            flex: 1,
          },
          {
            field: "action",
            headerName: "Action",

            minWidth: 70,
            width: 70,

            renderCell: (params) => {
              return <Button startIcon={<DeleteIcon />}></Button>;
            },
          },
          // { field: "brand_updatedAt", headerName: "brand updatedAt", width: 90 },
        ]
      : [
          {
            field: "image",
            headerName: "Image",
            minWidth: 70,
            width: 70,
            renderCell: (params) => (
              <Avatar
                alt="Kristagram"
                src="https://cdn.pixabay.com/photo/2018/02/09/21/46/rose-3142529__340.jpg"
                onClick={() => {
                  // console.log(')))',params.value)
                  setImg(
                    "https://cdn.pixabay.com/photo/2018/02/09/21/46/rose-3142529__340.jpg"
                  );
                  handleClickOpen();
                }}
              />
            ),
          },
          {
            field: "phone",
            headerName: "Phone",
            minWidth: 130,
            width: 130,
            flex: 1,
          },

          {
            field: "createdAt",
            headerName: "CreatedAt",
            width: 210,
            flex: 1,
            minWidth: 210,
          },
          // {
          //   field: "status",
          //   headerName: "status",
          //   width: "100px",
          //   minWidth: 80,
          //   flex: 1,
          // },
          // {
          //   field: "type_of_user",
          //   headerName: "type_of_user",
          //   width: "100px",
          //   minWidth: 80,
          //   flex: 1,
          // },
          {
            field: "updatedAt",
            headerName: "UpdatedAt",
            minWidth: 210,
            width: 210,
            flex: 1,
          },
          {
            field: "action",
            headerName: "Action",

            minWidth: 70,
            width: 70,

            renderCell: (params) => {
              return <Button startIcon={<DeleteIcon />}></Button>;
            },
          },

          // { field: "brand_createdAt", headerName: "brand createdAt", width: 90 },

          // {
          //   field: "brand_type_of_brand",
          //   headerName: "Type of brand",
          //   minWidth: 150,
          //   width: 150,
          //   flex: 1,
          // },
          // {
          //   field: "brand_user_id",
          //   headerName: "User id",
          //   minWidth: 200,
          //   width: 200,
          //   flex: 1,
          // },
        ];
  const rows = [];
  const formatDate = (dateString) => {
    const options =
      ("en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        hour12: true,
        minute: "2-digit",
        second: "2-digit",
      });
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  arr.map((item, i) => {
    return rows.push({
      image: item?.profile_image,
      id: i + 1,
      phone: item?.phone,
      createdAt: formatDate(item?.createdAt),
      status: item?.status,
      type_of_user: item?.type_of_user,
      updatedAt: formatDate(item?.updatedAt),
      brand_createdAt: item?.brands?.createdAt,
      brand_type_of_brand: item?.brands?.type_of_brand,
      brand_user_id: item?.brands?.user_id,
      brand_updatedAt: item?.brands?.updatedAt,
    });
  });

  const data =
    arr.length == 0 ? (
      <div>
        <h1 style={{ textAlign: "center" }}>No Data Found</h1>
      </div>
    ) : (
      <Box sx={{ height: 630, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowCount={pageState.total}
          loading={pageState.isLoading}
          rowsPerPageOptions={[10]}
          pagination
          page={pageState.page - 1}
          pageSize={pageState.pageSize}
          paginationMode="server"
          onPageChange={(newPage) => {
            setPageState((old) => ({ ...old, page: newPage + 1 }));
          }}
          onPageSizeChange={(newPageSize) =>
            setPageState((old) => ({ ...old, pageSize: newPageSize }))
          }
        />
      </Box>
    );

  return (
    <div style={{ padding: "10px", paddingLeft: "250px" }}>
      <PersistentDrawer />
      <Tabs>
        <TabList>
          <Tab
            onClick={() => {
              countData();
              getBrandAllData("brand", "approved");
              setMainTabVal(0);
              tabVal == 0
                ? getBrandAllData("brand", "approved")
                : tabVal == 1
                ? getBrandAllData("brand", "pending")
                : tabVal == 2
                ? getBrandAllData("brand", "suspended")
                : getBrandAllData("brand");
            }}
          >
            Brand
          </Tab>
          <Tab
            onClick={() => {
              countData();
              getBrandAllData("influencer", "approved");
              setMainTabVal(1);
              tabValIns == 0
                ? getBrandAllData("influencer", "approved")
                : tabValIns == 1
                ? getBrandAllData("influencer", "pending")
                : tabValIns == 2
                ? getBrandAllData("influencer", "suspended")
                : getBrandAllData("influencer");
            }}
          >
            Influencer
          </Tab>
        </TabList>
        <TabPanel>
          <Tabs>
            <TabList>
              <Tab
                onClick={() => {
                  countData();
                  setTabVal(0);
                  getBrandAllData("brand", "approved");
                }}
              >
                Approve : {totalVal.approvedBrand}
              </Tab>
              <Tab
                onClick={() => {
                  countData();
                  setTabVal(1);
                  getBrandAllData("brand", "pending");
                }}
              >
                Pending : {totalVal.pendingBrand}
              </Tab>

              <Tab
                onClick={() => {
                  countData();
                  setTabVal(2);
                  getBrandAllData("brand", "suspended");
                }}
              >
                Suspend :{totalVal.suspendBrand}
              </Tab>
              <Tab
                onClick={() => {
                  countData();
                  setTabVal(3);
                  getBrandAllData("brand");
                }}
              >
                All :{totalVal.allBrand}
              </Tab>
            </TabList>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
          </Tabs>
        </TabPanel>
        <TabPanel>
          <Tabs>
            <TabList>
              <Tab
                onClick={() => {
                  countData();
                  setTabValIns(0);
                  getBrandAllData("influencer", "approved");
                }}
              >
                Approve : {totalVal.approvedInfluencer}
              </Tab>
              <Tab
                onClick={() => {
                  countData();
                  setTabValIns(1);
                  getBrandAllData("influencer", "pending");
                }}
              >
                Pending : {totalVal.pendingInfluencer}
              </Tab>

              <Tab
                onClick={() => {
                  countData();
                  setTabValIns(2);
                  getBrandAllData("influencer", "suspended");
                }}
              >
                Suspend : {totalVal.suspendInfluencer}
              </Tab>
              <Tab
                onClick={() => {
                  countData();
                  setTabValIns(3);
                  getBrandAllData("influencer");
                }}
              >
                All : {totalVal.allInfluencer}
              </Tab>
            </TabList>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
          </Tabs>
        </TabPanel>
      </Tabs>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <CardMedia component="img" height="200" image={img} alt="Kristagram" />
      </Dialog>
    </div>
  );
};

export default Profile;
