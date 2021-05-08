var express = require('express');
var router = express.Router();
var pool = require('../db/db');

function formatToMonthYear(value){
    return (new Date(value).getMonth() + 1) + "/" + new Date(value).getFullYear().toString()
}

//get all cases
router.get('/all_cases', function(req, res, next){
    try{   
        pool.query("select * from covid_cases order by observation_date desc", function(err, result){
            if(err){
                res.send(err);
            }
            
            res.json(result.rows);
        });        
    }
    catch(err){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    }
});

//get distinct countries
router.get('/all_countries', function(req, res, next){
    try{   
        pool.query("select distinct country_region from covid_cases order by 1", function(err, result){
            if(err){
                res.send(err);
            }
            
            res.json(result.rows);
        });        
    }
    catch(err){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    }
});

//get cases by a country
router.get('/get_cases_by_country', function(req, res, next){
    try{   
        pool.query("select * from covid_cases where country_region='" + req.query.country + "' order by observation_date desc", function(err, result){
            if(err){
                res.send(err);
            }
            
            res.json(result.rows);
        });        
    }
    catch(err){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    }
});

//get cases summary by country
router.get('/get_summary_by_country', function(req, res, next){
    try{   
        var query = "select (select sum(confirmed) from covid_cases where country_region='" + req.query.country + "') total_confirmed,";
            query += "(select sum(recovered) from covid_cases where country_region='" + req.query.country + "') total_recovered,";
            query += "(select sum(deaths) from covid_cases where country_region='" + req.query.country + "') total_deaths";
            
        pool.query(query, function(err, result){
            if(err){
                res.send(err);
            }
            
            res.json(result.rows[0]);
        });        
    }
    catch(err){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    }
});

//get cases summary
router.get('/get_summary', function(req, res, next){
    try{   
        var query = "select (select sum(confirmed) from covid_cases) total_confirmed,";
            query += "(select sum(recovered) from covid_cases) total_recovered,";
            query += "(select sum(deaths) from covid_cases) total_deaths,";
            query += "(select coalesce(sum(confirmed),0) from covid_cases where observation_date = current_date) total_confirmed_today,";
            query += "(select coalesce(sum(recovered),0) from covid_cases where observation_date = current_date) total_recovered_today,";
            query += "(select coalesce(sum(deaths),0) from covid_cases where observation_date = current_date) total_deaths_today";

        pool.query(query, function(err, result){
            if(err){
                res.send(err);
            }
            
            res.json(result.rows[0]);
        });        
    }
    catch(err){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    }
});

//get top confirmed countries by observation date, limited
router.get('/top/confirmed', function(req, res, next){
    try{   
        if(!req.query.max_results){
            res.status(400);
            res.json({
                "error": "Bad Data"
            });
        }
        else{
            var query = "select country_region country,sum(confirmed) confirmed,sum(recovered) recovered,sum(deaths) deaths from covid_cases where observation_date='" + req.query.observation_date + "' ";
                query += "group by country_region order by sum(confirmed) desc limit " + req.query.max_results;
            
            pool.query(query, function(err, result){
                if(err){
                    res.send(err);
                }

                var chartValues = {
                    observation_date: req.query.observation_date,
                    countries: result.rows
                };
                
                res.json(chartValues);
            });   
        }     
    }
    catch(err){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    }
});


//get top confirmed countries
router.get('/get_top_confirmed_countries', function(req, res, next){
    try{   
        pool.query("select country_region,sum(confirmed) total from covid_cases group by country_region order by sum(confirmed) desc limit 10", function(err, result){
            if(err){
                res.send(err);
            }
            
            res.json(result.rows);
        });        
    }
    catch(err){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    }
});

//get top recovered countries
router.get('/get_top_recovered_countries', function(req, res, next){
    try{   
        pool.query("select country_region,sum(recovered) total from covid_cases group by country_region order by sum(recovered) desc limit 10", function(err, result){
            if(err){
                res.send(err);
            }
            
            res.json(result.rows);
        });        
    }
    catch(err){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    }
});

//get top deaths per countries
router.get('/get_top_deaths_countries', function(req, res, next){
    try{   
        pool.query("select country_region,sum(deaths) total from covid_cases group by country_region order by sum(deaths) desc limit 10", function(err, result){
            if(err){
                res.send(err);
            }
            
            res.json(result.rows);
        });        
    }
    catch(err){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    }
});

//get recap report
router.get('/get_recap_report', function(req, res, next){
    try{ 
        var query = "select (current_date - interval '8 months') month8, (current_date - interval '7 months') month7,";
            query += "(current_date - interval '6 months') month6, (current_date - interval '5 months') month5, (current_date - interval '4 months') month4,";
            query += "(current_date - interval '3 months') month3, (current_date - interval '2 months') month2, (current_date - interval '1 months') month1,";
            query += "current_date current_month";

        pool.query(query, function(err, result){
            if(err){
                res.send(err);
            }           
        
            var data = result.rows[0];
            var chartLabels = [formatToMonthYear(data.month8), formatToMonthYear(data.month7), formatToMonthYear(data.month6),
                                formatToMonthYear(data.month5), formatToMonthYear(data.month4), formatToMonthYear(data.month3),
                                formatToMonthYear(data.month2), formatToMonthYear(data.month1), formatToMonthYear(data.current_month)];        

            //confirmed cases
            query = "select (select sum(confirmed) from covid_cases where observation_date >= (current_date - interval '8 months') and observation_date < (current_date - interval '7 months')) month8_total,";
                query += "(select sum(confirmed) from covid_cases where observation_date >= (current_date - interval '7 months') and observation_date < (current_date - interval '6 months')) month7_total,";
                query += "(select sum(confirmed) from covid_cases where observation_date >= (current_date - interval '6 months') and observation_date < (current_date - interval '5 months')) month6_total,";
                query += "(select sum(confirmed) from covid_cases where observation_date >= (current_date - interval '5 months') and observation_date < (current_date - interval '4 months')) month5_total,";
                query += "(select sum(confirmed) from covid_cases where observation_date >= (current_date - interval '4 months') and observation_date < (current_date - interval '3 months')) month4_total,";
                query += "(select sum(confirmed) from covid_cases where observation_date >= (current_date - interval '3 months') and observation_date < (current_date - interval '2 months')) month3_total,";
                query += "(select sum(confirmed) from covid_cases where observation_date >= (current_date - interval '2 months') and observation_date < (current_date - interval '1 months')) month2_total,";
                query += "(select sum(confirmed) from covid_cases where observation_date >= (current_date - interval '1 months') and observation_date < current_date) month1_total,"
                query += "(select sum(confirmed) from covid_cases where observation_date >= current_date and observation_date < (current_date + interval '1 months')) current_total";

            pool.query(query, function(err, result){
                data = result.rows[0];
                var confirmedCases = [data.month8_total, data.month7_total, data.month6_total, data.month5_total, data.month4_total, data.month3_total, data.month2_total, data.month1_total, data.current_total];

                //recovered cases
                query = "select (select sum(recovered) from covid_cases where observation_date >= (current_date - interval '8 months') and observation_date < (current_date - interval '7 months')) month8_total,";
                    query += "(select sum(recovered) from covid_cases where observation_date >= (current_date - interval '7 months') and observation_date < (current_date - interval '6 months')) month7_total,";
                    query += "(select sum(recovered) from covid_cases where observation_date >= (current_date - interval '6 months') and observation_date < (current_date - interval '5 months')) month6_total,";
                    query += "(select sum(recovered) from covid_cases where observation_date >= (current_date - interval '5 months') and observation_date < (current_date - interval '4 months')) month5_total,";
                    query += "(select sum(recovered) from covid_cases where observation_date >= (current_date - interval '4 months') and observation_date < (current_date - interval '3 months')) month4_total,";
                    query += "(select sum(recovered) from covid_cases where observation_date >= (current_date - interval '3 months') and observation_date < (current_date - interval '2 months')) month3_total,";
                    query += "(select sum(recovered) from covid_cases where observation_date >= (current_date - interval '2 months') and observation_date < (current_date - interval '1 months')) month2_total,";
                    query += "(select sum(recovered) from covid_cases where observation_date >= (current_date - interval '1 months') and observation_date < current_date) month1_total,"
                    query += "(select sum(recovered) from covid_cases where observation_date >= current_date and observation_date < (current_date + interval '1 months')) current_total";

                pool.query(query, function(err, result){
                    data = result.rows[0];
                    var recoveredCases = [data.month8_total, data.month7_total, data.month6_total, data.month5_total, data.month4_total, data.month3_total, data.month2_total, data.month1_total, data.current_total];

                    //deaths
                    query = "select (select sum(deaths) from covid_cases where observation_date >= (current_date - interval '8 months') and observation_date < (current_date - interval '7 months')) month8_total,";
                        query += "(select sum(deaths) from covid_cases where observation_date >= (current_date - interval '7 months') and observation_date < (current_date - interval '6 months')) month7_total,";
                        query += "(select sum(deaths) from covid_cases where observation_date >= (current_date - interval '6 months') and observation_date < (current_date - interval '5 months')) month6_total,";
                        query += "(select sum(deaths) from covid_cases where observation_date >= (current_date - interval '5 months') and observation_date < (current_date - interval '4 months')) month5_total,";
                        query += "(select sum(deaths) from covid_cases where observation_date >= (current_date - interval '4 months') and observation_date < (current_date - interval '3 months')) month4_total,";
                        query += "(select sum(deaths) from covid_cases where observation_date >= (current_date - interval '3 months') and observation_date < (current_date - interval '2 months')) month3_total,";
                        query += "(select sum(deaths) from covid_cases where observation_date >= (current_date - interval '2 months') and observation_date < (current_date - interval '1 months')) month2_total,";
                        query += "(select sum(deaths) from covid_cases where observation_date >= (current_date - interval '1 months') and observation_date < current_date) month1_total,"
                        query += "(select sum(deaths) from covid_cases where observation_date >= current_date and observation_date < (current_date + interval '1 months')) current_total";

                    pool.query(query, function(err, result){
                        data = result.rows[0];
                        var deaths = [data.month8_total, data.month7_total, data.month6_total, data.month5_total, data.month4_total, data.month3_total, data.month2_total, data.month1_total, data.current_total];

                        var chartValues = {
                            labels: chartLabels,
                            confirmed: confirmedCases,
                            deaths: deaths,
                            recoveries: recoveredCases
                        };
            
                        res.json(chartValues);    
                    });
                });            
            });                    
        });     
    }   
    catch(err){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    }
});

//get a case
router.get('/case/:id', function(req, res, next){ 
    try{  
        pool.query("select * from covid_cases where id=$1 limit 1", [req.params.id], function(err, result){
            if(err){
                res.send(err);
            }
             
            res.json(result.rows);
        });  
    }
    catch(err){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    }  
});

//new case
router.post('/case', function(req, res, next){
    try{        
        var covidCase = req.body;

        if(!covidCase.observation_date || !covidCase.country_region){
            res.status(400);
            res.json({
                "error": "Bad Data"
            });
        }
        else{
            var newCase = pool.query("insert into covid_cases(observation_date,province_state,country_region,last_updated,confirmed,deaths,recovered) values($1,$2,$3,$4,$5,$6,$7)", 
                [covidCase.observation_date, covidCase.province_state, covidCase.country_region, covidCase.last_updated, covidCase.confirmed, covidCase.deaths, covidCase.recovered]);
            res.json(req.body);
        }
    }   
    catch(err){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    }
});

//update a case

module.exports = router;