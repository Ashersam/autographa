import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useBibleReference } from 'bible-reference-rcl';
import {
    Button,
    ButtonGroup, Tabs,
} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import CustomDialog from '../../ApplicationBar/CustomDialog';
import CustomBooksTab from './CustomBooksTab';

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
const BookNavigation = ({ initial }) => {
  const {
    initialBook,
    initialChapter,
    initialVerse,
    supportedBooks,
    onChange,
  } = initial || {};

  const {
 state: {
    chapter,
    verse,
    bookList,
    chapterList,
    verseList,
    bookName,
 }, actions: {
    onChangeBook,
    onChangeChapter,
    onChangeVerse,
    applyBooksFilter,
  },
} = useBibleReference({
    initialBook,
    initialChapter,
    initialVerse,
    onChange,
  });

  const [value, setValue] = React.useState(0);
  const [dialog, setDialog] = React.useState(false);
  const [OTSelectionSort, setOTSelectionSort] = React.useState(true);
  const [NTSelectionSort, setNTSelectionSort] = React.useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    applyBooksFilter(supportedBooks);
  }, [applyBooksFilter, supportedBooks]);

  const handleClose = () => {
    setDialog(false);
  };

  const openDialog = (e) => {
    e.preventDefault();
    setDialog(true);
    setValue(0);
    setOTSelectionSort(true);
    setNTSelectionSort(true);
  };

  // eslint-disable-next-line no-unused-vars
  const BookReferenceTabsTitle = (
    <AppBar position="static" color="primary">
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab label={`${bookName}`} {...a11yProps(0)} />
        <Tab label={`Chapter: ${chapter}`} {...a11yProps(1)} />
        <Tab label={`Verse: ${verse}`} {...a11yProps(2)} />
      </Tabs>
    </AppBar>
  );

  const BookReferenceTabsOT = (
    <div>
      <CustomBooksTab
        onChangeBook={onChangeBook}
        onChangeChapter={onChangeChapter}
        onChangeVerse={onChangeVerse}
        setDialog={setDialog}
        value={value}
        bookList={bookList}
        chapterList={chapterList}
        verseList={verseList}
        setValue={setValue}
        OT
        setOTSelectionSort={setOTSelectionSort}
        setNTSelectionSort={setNTSelectionSort}
      />
    </div>
  );

  const BookReferenceTabsNT = (
    <div>
      <CustomBooksTab
        onChangeBook={onChangeBook}
        onChangeChapter={onChangeChapter}
        onChangeVerse={onChangeVerse}
        setDialog={setDialog}
        value={value}
        bookList={bookList}
        chapterList={chapterList}
        verseList={verseList}
        setValue={setValue}
        OT={false}
        setOTSelectionSort={setOTSelectionSort}
        setNTSelectionSort={setNTSelectionSort}
      />
    </div>
  );
    return (
      <div>
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
          <Button onClick={(e) => openDialog(e)}>{`${bookName}`}</Button>
          <Button>{`Chapter: ${chapter}`}</Button>
          <Button>{`Verse: ${verse}`}</Button>
        </ButtonGroup>
        <div
          style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >
          <CustomDialog
            open={dialog}
            handleClose={handleClose}
            title="Bible Reference"
            subtitle1={OTSelectionSort ? 'Old Testment' : ''}
            subtitle2={NTSelectionSort ? 'New Testment' : ''}
            subcontent1={OTSelectionSort ? BookReferenceTabsOT : ''}
            subcontent2={NTSelectionSort ? BookReferenceTabsNT : ''}
            width="md"
          />
        </div>
      </div>
     );
};

export default BookNavigation;
BookNavigation.propTypes = {
  initial: PropTypes.object,
};
