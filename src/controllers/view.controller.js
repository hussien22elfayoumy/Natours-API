export const getOverviewView = (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours',
  });
};

export const getTourView = (req, res) => {
  res.status(200).render('tour', {
    title: `The Forest Hiker`,
  });
};
