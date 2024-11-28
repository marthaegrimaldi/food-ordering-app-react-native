import React, { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { withTranslation } from 'react-i18next'
// core components
import Header from '../components/Headers/Header'
import { getRestaurantDetail, deleteFood } from '../apollo'
import FoodComponent from '../components/Food/Food'
import CustomLoader from '../components/Loader/CustomLoader'
import DataTable from 'react-data-table-component'
import orderBy from 'lodash/orderBy'
import { transformToNewline } from '../utils/stringManipulations'
import SearchBar from '../components/TableHeader/SearchBar'
import useGlobalStyles from '../utils/globalStyles'
import {
  Container,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Typography,
  ListItemIcon
} from '@mui/material'
import { customStyles } from '../utils/tableCustomStyles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import TableHeader from '../components/TableHeader'
import Alert from '../components/Alert'
import ConfigurableValues from '../config/constants'

const GET_FOODS = gql`
  ${getRestaurantDetail}
`
const DELETE_FOOD = gql`
  ${deleteFood}
`
const Food = props => {
  const { t } = props
  const { PAID_VERSION } = ConfigurableValues()
  const [editModal, setEditModal] = useState(false)
  const [food, setFood] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const onChangeSearch = e => setSearchQuery(e.target.value)
  const restaurantId = localStorage.getItem('restaurantId')

  const [mutate, { loading }] = useMutation(DELETE_FOOD, {
    refetchQueries: [{ query: GET_FOODS, variables: { id: restaurantId } }]
  })
  const { data, error: errorQuery, loading: loadingQuery, refetch } = useQuery(
    GET_FOODS,
    {
      variables: {
        id: restaurantId
      }
    }
  )
  const toggleModal = food => {
    setEditModal(!editModal)
    setFood(food)
  }
  const closeEditModal = () => {
    setEditModal(false)
  }

  const propExists = (obj, path) => {
    return path.split('.').reduce((obj, prop) => {
      return obj && obj[prop] ? obj[prop] : ''
    }, obj)
  }

  const customSort = (rows, field, direction) => {
    const handleField = row => {
      if (field && isNaN(propExists(row, field))) {
        return propExists(row, field).toLowerCase()
      }

      return row[field]
    }
    return orderBy(rows, handleField, direction)
  }

  const columns = [
    {
      name: t('Title'),
      selector: 'title',
      sortable: true
    },
    {
      name: t('Description'),
      sortable: true,
      selector: 'description',
      cell: row => <>{transformToNewline(row.description, 3)}</>
    },
    {
      name: t('Category'),
      sortable: true,
      selector: 'category.category',
      cell: row => <>{row.category}</>
    },
    {
      name: t('Image'),
      cell: row => (
        <>
          <img
            className="img-responsive"
            style={{ width: 30, height: 30, borderRadius: 15 }}
            src={
              row.image ||
              'https://enatega.com/wp-content/uploads/2023/11/man-suit-having-breakfast-kitchen-side-view.webp'
            }
            alt={row.image ? 'img menu' : 'Default Image'}
          />
        </>
      )
    },
    {
      name: t('Action'),
      cell: row => <>{actionButtons(row)}</>
    }
  ]
  const actionButtons = row => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = event => {
      setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
      setAnchorEl(null)
    }
    return (
      <>
        <div>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-haspopup="true"
            onClick={handleClick}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Paper>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button'
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}>
              <MenuItem
                onClick={e => {
                  e.preventDefault()
                  if (PAID_VERSION) toggleModal(row)
                  else {
                    setIsOpen(true)
                    setTimeout(() => {
                      setIsOpen(false)
                    }, 5000)
                  }
                }}
                style={{ height: 25 }}>
                <ListItemIcon>
                  <EditIcon fontSize="small" style={{ color: 'green' }} />
                </ListItemIcon>
                <Typography color="green">{t('Edit')}</Typography>
              </MenuItem>
              <MenuItem
                onClick={e => {
                  e.preventDefault()
                  if (PAID_VERSION)
                    mutate({
                      variables: {
                        id: row._id,
                        restaurant: restaurantId,
                        categoryId: row.categoryId
                      }
                    })
                  else {
                    setIsOpen(true)
                    setTimeout(() => {
                      setIsOpen(false)
                    }, 5000)
                  }
                }}
                style={{ height: 25 }}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" style={{ color: 'red' }} />
                </ListItemIcon>
                <Typography color="red">{t('Delete')}</Typography>
              </MenuItem>
            </Menu>
          </Paper>
        </div>
      </>
    )
  }

  const foodsList = categories => {
    const list = []
    categories &&
      categories.forEach(category => {
        if (category.foods && category.foods.length) {
          return category.foods.map(item => {
            list.push({
              ...item,
              category: category.title,
              categoryId: category._id,
              ...category,
              _id: item._id,
              title: item.title
            })

            return {
              ...item,
              category: category.title,
              categoryId: category._id,
              ...category,
              _id: item._id,
              title: item.title
            }
          })
        }
      })
    return list
  }
  const regex =
    searchQuery.length > 2 ? new RegExp(searchQuery.toLowerCase(), 'g') : null

    const filteredFoods = foodsList(data && data.restaurant.categories)
    .filter(food => !(food.category === "Default Category" || food.title === "Default Food"))

  const filtered =
    searchQuery.length < 3
      ? filteredFoods
      : filteredFoods.filter(food => {
          return (
            food.title.toLowerCase().search(regex) > -1 ||
            food.description.toLowerCase().search(regex) > -1 ||
            food.category.toLowerCase().search(regex) > -1
          )
        })
  const globalClasses = useGlobalStyles()

  return (
    <>
      <Header />
      {/* Page content */}
      {isOpen && (
        <Alert message={t('AvailableAfterPurchasing')} severity="warning" />
      )}
      <Container className={globalClasses.flex} fluid>
        <FoodComponent />
        {errorQuery && <span>`Error! ${errorQuery.message}`</span>}
        {loadingQuery ? (
          <CustomLoader />
        ) : (
          <DataTable
            subHeader={true}
            subHeaderComponent={
              <SearchBar
                value={searchQuery}
                onChange={onChangeSearch}
                onClick={() => refetch()}
              />
            }
            title={<TableHeader title={t('Food')} />}
            columns={columns}
            data={data && data.restaurant ? filtered : {}}
            pagination
            progressPending={loading}
            progressComponent={<CustomLoader />}
            sortFunction={customSort}
            defaultSortField="title"
            customStyles={customStyles}
            selectableRows
            paginationIconLastPage=""
            paginationIconFirstPage=""
          />
        )}
        <Modal
          open={editModal}
          onClose={() => {
            toggleModal()
          }}
          style={{
            marginLeft: '13%',
            overflowY: 'auto'
          }}>
          <FoodComponent food={food} onClose={closeEditModal} />
        </Modal>
      </Container>
    </>
  )
}

export default withTranslation()(Food)
