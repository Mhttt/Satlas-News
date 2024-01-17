export const styles = {
  map: {
    img: {
      objectFit: 'cover',
      width: '100%',
      height: '100%',
    },
    position: 'relative',
    height: '200px',
    minWidth: '30%',
  },
  elementsContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 3,
    minWidth: '70%',
    padding: '0px 5px',
  },
  topElements: {
    display: 'flex',
    p: 0,
    maxHeight: '50%',
    width: '100%',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: 2,
    boxSizing: 'border-box',
    width: '100%',
  },
  fireAndTitle: {
    display: 'flex',
    alignItems: 'center',
    '& .title': {
      fontWeight: 'bold',
      display: 'inline-block',
      color: 'primary.main',
      width: '100%',
      overflow: 'auto',
      overflowWrap: 'break-word'
    },
    '& .location': {
      variant: 'body1',
      fontSize: '14px',
      display: 'inline-block',
      position: 'relative',
      m: 0,
      color: 'primary.main',
    },
    width: '100%',
    svg: {
      fontSize: 'xxx-large',
    },
  },
  description: {
    variant: 'body1',
    fontSize: '15px',
    overflowWrap: 'break-word',
    padding: '0px 5px',
    overflow: 'auto',
    boxSizing: 'border-box',
    width: '100%',
  },
  button1Large: {
    color: 'secondary.main',
    width: '23%',
    m: 1,
    alignSelf: 'flex-end',
  },
  button2Large: {
    backgroundColor: 'secondary.main',
    width: '23%',
    m: 1,
  },
  button1Small: {
    color: 'secondary.main',
    m: 1,
  },
  button2Small: {
    backgroundColor: 'secondary.main',
    m: 1,
  },
  tags: {
    width: '72%',
    flexWrap: 'wrap',
    m: 1,
  },
  menuitem: {
    color: 'primary.main',
    '& a': {
      textDecoration: 'none',
      color: 'primary.main',
    },
  },
  dotMenu: {
    position: 'absolute',
    width: '35px',
    height: '35px',
    right: '5px',
    top: '10px',
    zIndex: '1',
    '&:hover': {
      cursor: 'pointer',
    },
  },
};
