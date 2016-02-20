import {expect} from 'chai';
import * as pg from '../../src/index';

const SELECT = {
  row: 'select 1 as id, 2 as value',
  rows: 'select oid, typname from pg_type limit 2',
  empty: 'select * from pg_type where false',
  error: 'ERROR'
};

testWithDriver('pg', require('pg'));
testWithDriver('pg.native', require('pg').native);

function testWithDriver(driverName, driver) {
  describe(`pg-async connect (with ${driverName} driver)`, () => {

    beforeEach(() => {
      pg.driver(driver);
      pg.setDefaultConnection(null);
    });

    after(() => {
      pg.closeConnections();
    });

    it('should fail if invalid connection conf', async () => {
      try {
        await pg.connect('INVALID', async () => null);
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
      }
    });

    it('should fail if invalid default connection', async () => {
      pg.setDefaultConnection('INVALID');
      try {
        await pg.connect('INVALID', async () => null);
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
      }
    });

    it('should fail if invalid callback', async () => {
      try {
        await pg.connect();
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
      }
    });

    describe('method', () => {
      it('query works', async () => {
        await pg.connect(async (q) => {

          const row = await q(SELECT.row);
          expect(row.rows).to.have.length(1);

          const rows = await q(SELECT.rows);
          expect(rows.rows).to.have.length(2);

          const rows2 = await q(SELECT.rows);
          expect(rows2.rows).to.have.length(2);

          const none = await q(SELECT.empty);
          expect(none.rows).to.have.length(0);

          try {
            await q(SELECT.error);
          } catch (err) {
            expect(err).to.be.instanceOf(Error);
          }

        });
      });

      it('query.query works', async () => {
        await pg.connect(async (q) => {

          const row = await q.query(SELECT.row);
          expect(row.rows).to.have.length(1);

          const rows = await q.query(SELECT.rows);
          expect(rows.rows).to.have.length(2);

          const none = await q.query(SELECT.empty);
          expect(none.rows).to.have.length(0);

          try {
            await q.query(SELECT.error);
          } catch (err) {
            expect(err).to.be.instanceOf(Error);
          }

        });
      });

      it('query.rows works', async () => {
        await pg.connect(async (q) => {

          const row = await q.rows(SELECT.row);
          expect(row).to.have.length(1);

          const rows = await q.rows(SELECT.rows);
          expect(rows).to.have.length(2);

          const none = await q.rows(SELECT.empty);
          expect(none).to.have.length(0);

          try {
            await q.rows(SELECT.error);
          } catch (err) {
            expect(err).to.be.instanceOf(Error);
          }

        });
      });

      it('query.row works', async () => {
        await pg.connect(async (q) => {

          const row = await q.row(SELECT.row);
          expect(row).to.be.a('object');

          try {
            await q.row(SELECT.rows);
          } catch (err) {
            expect(err).to.be.instanceOf(Error);
          }

          try {
            await q.row(SELECT.empty);
          } catch (err) {
            expect(err).to.be.instanceOf(Error);
          }

          try {
            await q.row(SELECT.error);
          } catch (err) {
            expect(err).to.be.instanceOf(Error);
          }

        });
      });

      it('query.value works', async () => {
        await pg.connect(async (q) => {

          const value = await q.value(`SELECT 'value'`);
          expect(value).to.be.equal('value');

          try {
            await q.value(SELECT.row);
          } catch (err) {
            expect(err).to.be.instanceOf(Error);
          }

          try {
            await q.value(SELECT.rows);
          } catch (err) {
            expect(err).to.be.instanceOf(Error);
          }

          try {
            await q.value(SELECT.empty);
          } catch (err) {
            expect(err).to.be.instanceOf(Error);
          }

          try {
            await q.value(SELECT.error);
          } catch (err) {
            expect(err).to.be.instanceOf(Error);
          }

        });
      });

      it('rows - shorthand works', async () => {
        const row = await pg.rows(SELECT.row);
        expect(row).to.have.length(1);
        const rows = await pg.rows(SELECT.rows);
        expect(rows).to.have.length(2);
        const none = await pg.rows(SELECT.empty);
        expect(none).to.have.length(0);
      });

    });

  });
}
