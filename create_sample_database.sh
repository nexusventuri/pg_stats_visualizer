#!/bin/bash
set -e
SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
target_folder="$SCRIPT_DIRECTORY/storage/postgres_sample"


if command -v psql &> /dev/null; then 
  echo 'psql found, pulling latest version of docker postgres'; 
else 
  echo 'psql not found, please install it before going on'; 
  exit 1;
fi

docker pull 'postgres:11.2';
mkdir -p $target_folder;
#docker run --rm --name pg-stat-visualizer-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v "$target_folder:/var/lib/postgresql/data" postgres:11.2;

echo 'Downloading sample db'

mkdir -p tmp/db_import/script
mkdir -p tmp/db_import/data
mkdir -p tmp/db_import/merge
git clone git@github.com:lorint/AdventureWorks-for-Postgres.git tmp/db_import/script
#
cd tmp/db_import/data
git init
git remote add -f origin git@github.com:Microsoft/sql-server-samples.git
git config core.sparseCheckout true
echo "/samples/databases/adventure-works/oltp-install-script/" >> .git/info/sparse-checkout
git pull origin master
find . -iname '*.csv' -exec mv {} ../merge \;
cd ..
mv script/update_csvs.rb merge
mv script/install.sql merge
cd merge 
ruby update_csvs.rb

until PGPASSWORD=docker psql -h localhost -U postgres -d postgres -c 'create database "adventureworks";'
do 
  sleep 1
done

PGPASSWORD=docker psql -h localhost -U postgres -d postgres -d adventureworks < install.sql

# On my machine this produces the following tables
#
# Person.BusinessEntity: 20777
# Person.Person: 19972
# Person.AddressType: 6
# Person.ContactType: 20
# Person.BusinessEntityContact: 909
# Person.EmailAddress: 19972
# Person.Password: 19972
# Person.PhoneNumberType: 3
# Person.PersonPhone: 19972
# Person.CountryRegion: 238
# HumanResources.Department: 16
# HumanResources.Shift: 3
# Production.Culture: 8
# Production.ProductCategory: 4
# Production.ProductSubcategory: 37
# Production.ProductModel: 128
# Production.ProductDescription: 762
# Production.Location: 14
# Production.Illustration: 5
# Production.ProductModelIllustration: 7
# Production.ProductModelProductDescriptionCulture: 762
# Production.ProductPhoto: 101
# Production.ScrapReason: 16
# Production.TransactionHistoryArchive: 89253
# Production.UnitMeasure: 38
# Purchasing.ShipMethod: 5
# Purchasing.Vendor: 104
# Sales.CreditCard: 19118
# Sales.Currency: 105
# Sales.CurrencyRate: 13532
# Sales.PersonCreditCard: 19118
# Sales.SalesReason: 10
# Sales.SalesTerritory: 10
# Sales.SpecialOffer: 16
